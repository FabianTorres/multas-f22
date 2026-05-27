// Archivo: src/logic/calculadoraF22.ts
import { REGLAS_SII } from '../../../config/constantes';
import { TABLA_TASAS_DIARIAS } from '../../../config/tasasInteres';
import { VALORES_HISTORICOS } from '../../../config/parametrosHistoricos';

export interface DatosIngresoF22 {
    codigo305: number;
    vector644: number;
    fechaVencimiento: string;
    fechaPago: string;
    esDolares: boolean;
    tcvig: number;
}

export interface ResultadoF22 {
    codigo305: number; codigo91: number; codigo92: number; codigo93: number;
    codigo60: number; codigo795: number; codigo94: number;
    mesesAtraso: number; sumaInteresDiario: number; porcentajeCondonacion: number;
    auditoria: {
        constantes: { p: number; a: number; b: number; d: number; phi: number; d_multa: number; d_intereses: number };
        tiempo: { ipcMesAnterior: number; ipcFebrero: number; reaj: number; utm: number };
        factores: { cmul: number; cintBase: number; cintSpread: number; multaMinima: number };
        sumatorias: { intBase: number; intSpread: number };
    };
}

// ==========================================
// CAPA 1: FUNCIONES (Según Pág. 3 del PDF)
// ==========================================

function POS(X: number): number {
    return Math.max(0, X);
}

/**
 * NMES{X}: Número de meses entre el periodo X y 04/AT (Pág. 3)
 * X es la fecha de pago real.
 */
function NMES(fechaPago: Date): number {
    const anioTributario = REGLAS_SII.ANIO_TRIBUTARIO;

    // El ancla es el 30 de abril del Año Tributario
    const anioActual = fechaPago.getFullYear();
    const mesActual = fechaPago.getMonth(); // 0 = Enero, 3 = Abril

    // Calculamos la diferencia total de meses contra Abril (3) del AT
    const diffMeses = (anioActual - anioTributario) * 12 + (mesActual - 3);

    // Si el resultado es negativo (pago antes de abril del AT), NMES es 0
    return POS(diffMeses);
}

// MULTA{X} = MIN{ 0,10 + 0,02*POS{NMES{X}-5} ; 0,30 }
function MULTA(fechaPago: Date): number {
    const meses = NMES(fechaPago); // <-- Aquí está el NMES{X} del documento
    const calculo = 0.10 + 0.02 * POS(meses - 5);
    const valorMinimo = Math.min(calculo, 0.30);
    return Number(valorMinimo.toFixed(2));
}

/**
 * MESAANT{X}: Determina el mes calendario ante anterior
 */
function MESAANT(fechaX: Date): Date {
    const d = new Date(fechaX.getTime());
    // Seteamos el día 1 para evitar problemas con meses de distinta duración (ej: 31 de marzo)
    d.setDate(1);
    d.setMonth(d.getMonth() - 2);
    return d;
}

// IPC{X}
export function IPC(fecha: Date): number {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const clave = `${año}-${mes}`;

    const valor = VALORES_HISTORICOS[clave]?.ipc;
    if (valor === undefined) {
        throw new Error(`[QA ERROR] Falta definir el IPC para el periodo ${clave} en parametrosHistoricos.ts`);
    }

    if (!valor) console.warn(`Cuidado: Falta el IPC para ${clave} en parametrosHistoricos.ts`);
    return valor;
}

// UTM{X} (Queda lista para cuando la usemos en los NOD)
export function UTM(fecha: Date): number {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const clave = `${año}-${mes}`;

    const valor = VALORES_HISTORICOS[clave]?.utm;
    // Si la UTM no existe, lanzamos un error
    if (valor === undefined) {
        throw new Error(`[QA ERROR] Falta definir la UTM para el periodo ${clave} en parametrosHistoricos.ts`);
    }
    return valor;
}

/**
 * REAJ{X}: Factor de actualización 
 * Usa IPC(MESAANT{X}) e IPC(02/AT)
 */
function REAJ(fechaPago: Date): number {
    const anioTributario = REGLAS_SII.ANIO_TRIBUTARIO;

    const fechaMesAnterior = MESAANT(fechaPago);
    const ipcMesAnterior = IPC(fechaMesAnterior);

    // El documento fija el IPC de comparación en Febrero (02) del Año Tributario
    const fechaFebreroAT = new Date(anioTributario, 1, 1);
    const ipcFebrero = IPC(fechaFebreroAT);

    // El reajuste solo aplica si el mes anterior al pago es posterior a Febrero del AT
    if (fechaMesAnterior <= fechaFebreroAT) return 0;

    const factor = (ipcMesAnterior - ipcFebrero) / ipcFebrero;
    return POS(Number(factor.toFixed(3)));
}

// Función Auxiliar para la sumatoria de tasas (Aproximada a 4 decimales)
function SUMATORIA_TASAS(vVencimiento: Date, vPago: Date, tipo: 'base' | 'spread'): number {
    let sumCruda = 0;
    if (vPago > vVencimiento) {
        let diaActual = new Date(vVencimiento);
        diaActual.setDate(diaActual.getDate() + 1); // fv+1
        while (diaActual <= vPago) {
            const fechaClave = `${String(diaActual.getDate()).padStart(2, '0')}-${String(diaActual.getMonth() + 1).padStart(2, '0')}-${diaActual.getFullYear()}`;
            const datosDia = TABLA_TASAS_DIARIAS[fechaClave];
            if (datosDia) {
                sumCruda += tipo === 'base' ? datosDia.tasaBaseDiaria : datosDia.spreadDiario;
            }
            diaActual.setDate(diaActual.getDate() + 1);
        }
    }
    return Math.round(sumCruda * 10000) / 10000;
}


// ==========================================
// CAPA 2: CONSTANTES F22 (Según Pág. 3 y 4 del PDF)
// ==========================================

export function calcularF22(datos: DatosIngresoF22): ResultadoF22 {
    const vVencimiento = new Date(datos.fechaVencimiento + 'T00:00:00');
    const vPago = new Date(datos.fechaPago + 'T00:00:00'); // Esto es el Código [315]
    const mesesAtraso = NMES(vPago);

    // [ p ] = (1 + P30) * POS{[305]}
    const p = (1 + REGLAS_SII.P30_FACTOR) * POS(datos.codigo305);

    // [ a ] = Multa Fija (Según los 3 IF de la Pág. 3)
    let a = 0;
    if (datos.codigo305 === 0) a = UTM(vPago);
    else if (datos.codigo305 < 0) a = UTM(vPago) * Math.min(mesesAtraso, 12);
    else a = 0;

    // [ b ] = [ p ] * REAJ{[315]}
    const b = p * REAJ(vPago);

    // Sumatorias y Factores para [ d ]
    const sum_int_base = SUMATORIA_TASAS(vVencimiento, vPago, 'base');
    const sum_int_spread = SUMATORIA_TASAS(vVencimiento, vPago, 'spread');
    const factorMulta = MULTA(vPago);

    // [ d ] = ([p]+[b])*(sum_int_base) + ([p]+[b])*(sum_int_spread) + ([p]+[b])*MULTA
    // Nota: Redondeamos cada sumando a cero decimal como indica el documento
    const sumandoIntBaseD = Math.round((p + b) * sum_int_base);
    const sumandoIntSpreadD = Math.round((p + b) * sum_int_spread);
    const sumandoMultaD = Math.round((p + b) * factorMulta);
    const d = sumandoIntBaseD + sumandoIntSpreadD + sumandoMultaD;

    // --- SELECCIÓN DE FACTORES i (Pág. 4) ---
    let CMUL = 0, CINT_base = 0, CINT_spread = 0;
    if (mesesAtraso >= 1 && mesesAtraso <= 3) { CMUL = 0.70; CINT_base = 0.00; CINT_spread = 0.75; }
    else if (mesesAtraso >= 4 && mesesAtraso <= 12) { CMUL = 0.50; CINT_base = 0.00; CINT_spread = 0.55; }
    else if (mesesAtraso >= 13 && mesesAtraso <= 18) { CMUL = 0.30; CINT_base = 0.00; CINT_spread = 0.30; }
    else if (mesesAtraso >= 19 && mesesAtraso <= 24) { CMUL = 0.20; CINT_base = 0.00; CINT_spread = 0.15; }
    else if (mesesAtraso >= 25) { CMUL = 0.00; CINT_base = 0.00; CINT_spread = 0.00; }

    // [ φ ] = (1 - Vx010644) * [CINT_base * (sumando_base) + CINT_spread * (sumando_spread) + CMUL * (sumando_multa)]
    // Esta es la constante que faltaba en esta posición:
    const condBase = Math.round(sumandoIntBaseD * CINT_base);
    const condSpread = Math.round(sumandoIntSpreadD * CINT_spread);
    const condMulta = Math.round(sumandoMultaD * CMUL);
    const phi = (condBase + condSpread + condMulta) * (1 - datos.vector644);

    // ==========================================
    // CAPA 3: ALGORITMOS DE CÁLCULO 
    // ==========================================

    let codigo91 = 0, codigo92 = 0, codigo93 = 0, codigo60 = 0, codigo795 = 0, codigo94 = 0;

    if (datos.codigo305 <= 0) {
        // --- Declaración F22 Sin Pago ([305] <= 0) ---
        codigo91 = 0;
        codigo92 = 0; // [92] = 0
        codigo93 = Math.round(a / datos.tcvig); // [93] = [a] / [TC_VIG] 

        // [60] = {CMUL[i] * 100} * (1 - Vx644)
        codigo60 = Math.round(CMUL * 100) * (1 - datos.vector644);

        // [795] = [93] * [60] / 100
        codigo795 = Math.round((codigo93 * codigo60) / 100);

        // [94] = [p] + [92] + POS{[93] - [795]}
        codigo94 = Math.round(p) + codigo92 + POS(codigo93 - codigo795);

    } else if (datos.esDolares) {
        // --- Declaración F22 US$ Con Pago ---
        codigo91 = Math.round(POS(datos.codigo305)); // [91] = [305] + [39] (Sin P30)
        codigo92 = 0;

        // [93] = ([91])*(sum_int_base) + ([91])*(sum_int_spread) + [91]*MULTA
        const sumIntBaseUS = Math.round(codigo91 * sum_int_base);
        const sumIntSpreadUS = Math.round(codigo91 * sum_int_spread);
        const sumMultaUS = Math.round(codigo91 * factorMulta);
        codigo93 = sumIntBaseUS + sumIntSpreadUS + sumMultaUS;

        // [μ] = (1-Vx010644) * [CINT_base*... + CINT_spread*... + CMUL*...]
        const condBaseUS = Math.round(sumIntBaseUS * CINT_base);
        const condSpreadUS = Math.round(sumIntSpreadUS * CINT_spread);
        const condMultaUS = Math.round(sumMultaUS * CMUL);
        const mu = (condBaseUS + condSpreadUS + condMultaUS) * (1 - datos.vector644);

        // [60] = [μ] * 100 / [93]
        codigo60 = codigo93 !== 0 ? Math.round((mu * 100) / codigo93) : 0;

        // [795] = [93] * [60] / 100
        codigo795 = Math.round((codigo93 * codigo60) / 100);

        // [94] = [p] + [92] + POS{[93] - [795]}
        codigo94 = Math.round(p) + codigo92 + POS(codigo93 - codigo795);

    } else {
        // --- Declaración F22 Con Pago ---
        codigo91 = Math.round(p); // Equivalente lógico al Monto Impuesto (Base + P30)

        // [92] = [ b ]
        codigo92 = Math.round(b);

        // [93] = [ d ]
        codigo93 = d;

        // [60] = [phi] * 100 / [93]
        codigo60 = codigo93 !== 0 ? Math.round((phi * 100) / codigo93) : 0;

        // [795] = [93] * [60] / 100
        codigo795 = Math.round((codigo93 * codigo60) / 100);

        // [94] = [p] + [92] + POS{[93] - [795]}
        codigo94 = Math.round(p) + codigo92 + POS(codigo93 - codigo795);
    }

    // Para la auditoría, extraemos los valores macro que se usaron:
    const anioTributario = REGLAS_SII.ANIO_TRIBUTARIO;
    const ipcMesAnterior = IPC(MESAANT(vPago));
    const ipcFebrero = IPC(new Date(anioTributario, 1, 1));
    const utmAplicada = UTM(vPago);
    const d_multa = sumandoMultaD;
    const d_intereses = sumandoIntBaseD + sumandoIntSpreadD;

    return {
        codigo305: datos.codigo305, codigo91, codigo92, codigo93, codigo60, codigo795, codigo94,
        mesesAtraso, sumaInteresDiario: sum_int_base + sum_int_spread, porcentajeCondonacion: CMUL,
        // EMPAQUETADO DE AUDITORÍA PARA QA
        auditoria: {
            constantes: { p, a, b, d, phi, d_multa, d_intereses },
            tiempo: { ipcMesAnterior, ipcFebrero, reaj: REAJ(vPago), utm: utmAplicada },
            factores: { cmul: CMUL, cintBase: CINT_base, cintSpread: CINT_spread, multaMinima: factorMulta },
            sumatorias: { intBase: sum_int_base, intSpread: sum_int_spread }
        }
    };
}