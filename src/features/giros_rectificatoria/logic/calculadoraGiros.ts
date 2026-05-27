// Archivo: src/features/giros_rectificatoria/logic/calculadoraGiros.ts

import type { DatosIngresoGiros, ResultadoGiros } from './tiposGiros';
import { IPC } from '../../renta/logic/calculadoraF22';
import { REGLAS_SII } from '../../../config/constantes';
import { TABLA_TASAS_DIARIAS } from '../../../config/tasasInteres';

function obtenerFechaVencimientoLegal(): Date {
    return new Date(REGLAS_SII.ANIO_TRIBUTARIO, 3, 30);
}

function MESAANT(fecha: Date): Date {
    const d = new Date(fecha.getTime());
    d.setDate(1); d.setMonth(d.getMonth() - 2);
    return d;
}

function calcularMesesMulta(fechaInicio: Date, fechaFin: Date): number {
    let meses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth());
    const ultimoDiaMesInicio = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0).getDate();
    const esUltimoDia = fechaInicio.getDate() === ultimoDiaMesInicio;
    if (fechaFin.getDate() > fechaInicio.getDate() || (esUltimoDia && fechaFin.getDate() >= 1)) {
        meses++;
    }
    return Math.max(0, meses);
}

/**
 * Deflacta el monto de un cheque a la moneda de Diciembre del Año Tributario Anterior (AT-1).
 * Aplica las reglas exactas de truncamiento a 4 decimales y redondeo a 3 decimales.
 */
function deflactarCheque(montoCheque: number, fechaEmision: Date, anioTributario: number): number {
    // Pi = Índice IPC de Noviembre del AT-1
    // En JS, los meses van de 0 a 11 (Noviembre es 10)
    const fechaPi = new Date(anioTributario - 1, 10, 1);
    const Pi = IPC(fechaPi);

    // Pf = Índice IPC del mes inmediatamente anterior al cheque (Desfase de 1 mes)
    const fechaPf = new Date(fechaEmision.getFullYear(), fechaEmision.getMonth() - 1, 1);
    const Pf = IPC(fechaPf);

    // Si Pf no es mayor a Pi (no hubo inflación o es negativo), el valor se mantiene intacto.
    if (Pf <= Pi || Pi === 0) {
        return montoCheque;
    }

    // REGLAS SII DE REDONDEO ESTRICTO:
    const factorCrudo = Pf / Pi;

    // 1. Truncar a 4 decimales
    const factorTruncado = Math.trunc(factorCrudo * 10000) / 10000;

    // 2. Redondear a 3 decimales
    const factorRedondeado = Math.round(factorTruncado * 1000) / 1000;

    // 3. Monto final redondeado a 0 decimales
    return Math.round(montoCheque / factorRedondeado);
}

function calcularInteresDiario(fechaInicio: Date, fechaFin: Date, baseParaInteres: number): number {
    let sumaTasas = 0;
    // El interés empieza a correr desde el día siguiente
    let fechaActual = new Date(fechaInicio.getTime());
    fechaActual.setDate(fechaActual.getDate() + 1);

    while (fechaActual <= fechaFin) {
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const anio = fechaActual.getFullYear();
        const fechaStr = `${dia}-${mes}-${anio}`;

        const tasaDelDia = TABLA_TASAS_DIARIAS[fechaStr];

        if (tasaDelDia) {
            sumaTasas += tasaDelDia.tasaTotalDiaria;
        }
        // Avanzamos un día
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return Math.round(baseParaInteres * sumaTasas);
}

// NUEVO: Obtiene el porcentaje de condonación (0.7, 0.6, 0.55, 0.5)
function obtenerTasaCondonacion(mesesAtraso: number): number {
    if (mesesAtraso <= 3) return 0.70;
    if (mesesAtraso <= 12) return 0.60;
    if (mesesAtraso <= 24) return 0.55;
    return 0.50;
}

export function calcularGiros(datos: DatosIngresoGiros): ResultadoGiros {
    const { primitiva, rectificatoria, fechaRectificatoria, evidCod, cheques, canal, tieneVector644 } = datos;
    const fechaVencimiento = obtenerFechaVencimientoLegal();

    // Multiplicador del Vector 644 (1 si no lo tiene, 0 si lo tiene y bloquea)
    const factorV644 = tieneVector644 ? 0 : 1;

    const diferenciaImpuesto = Math.max(0, rectificatoria.codigo91) - Math.max(0, primitiva.codigo91);
    const generaGiro295 = diferenciaImpuesto > 0;

    const excesoDevuelto = Math.max(0, primitiva.codigo87) - Math.max(0, rectificatoria.codigo87);
    const generaGiro291 = excesoDevuelto > 0 && cheques.length > 0;

    let giro295Data = undefined;
    let giro291Data = undefined;

    // --- GIRO [295] ---
    if (generaGiro295) {
        const ipcVencimiento = IPC(MESAANT(fechaVencimiento));
        const ipcRectificatoria = IPC(MESAANT(fechaRectificatoria));
        const reajuste92 = Math.round(diferenciaImpuesto * Math.max(0, (ipcRectificatoria - ipcVencimiento) / ipcVencimiento));
        const baseInteres = diferenciaImpuesto + reajuste92;
        const interes93 = calcularInteresDiario(fechaVencimiento, fechaRectificatoria, baseInteres);

        let condonacion795 = 0;
        const mesesAtraso = calcularMesesMulta(fechaVencimiento, fechaRectificatoria);

        if (canal === 'INTERNET') {
            const cint = obtenerTasaCondonacion(mesesAtraso);
            const intGxD = 0.015 * mesesAtraso; // Regla teórica mensual para condonación
            // [795] = ([91]+[92]) * INT(GxD) * (CINT[i]) * (1-Vx010644)
            condonacion795 = Math.round((diferenciaImpuesto + reajuste92) * intGxD * cint * factorV644);
        }

        giro295Data = {
            capital91: diferenciaImpuesto,
            reajuste92: reajuste92,
            interes93: interes93,
            condonacion795: condonacion795,
            // [94] = [91] + [92] + POS( [93] - [795] )
            total94: diferenciaImpuesto + reajuste92 + Math.max(0, interes93 - condonacion795),
            diferenciaCalculada: diferenciaImpuesto,
            diasAtraso: 0
        };
    }

    // --- GIRO [291] ---
    if (generaGiro291) {
        let totalCapital = 0, totalReajuste = 0, totalMulta = 0, totalInteres = 0;
        let sumaPhi = 0; // Acumulador de (INT*CINT + MULTA*CMULT)
        const tipoMultaAplicada = evidCod.trim().toUpperCase().startsWith('I') ? 'DURA' : 'BLANDA';

        cheques.forEach(cheque => {
            // 1. DEFLACTAR A DICIEMBRE AT-1
            const montoDeflactado = deflactarCheque(cheque.montoCobrado, cheque.fechaEmision, REGLAS_SII.ANIO_TRIBUTARIO);

            // El total de capital base acumulado ahora usa el monto deflactado
            totalCapital += montoDeflactado;

            // 2. Inflar/Reajustar el cheque hasta la fecha actual
            // (Aquí mantenemos tu lógica anterior de IPC MESAANT para calcular el código [92])
            const ipcCheque = IPC(MESAANT(cheque.fechaEmision));
            const ipcActual = IPC(MESAANT(fechaRectificatoria));
            const factorReajusteCheque = Math.max(0, (ipcActual - ipcCheque) / ipcCheque);

            const reajusteCheque = Math.round(montoDeflactado * factorReajusteCheque); // <- ¡Ojo! El reajuste ahora se calcula sobre el deflactado
            const baseRecargos = montoDeflactado + reajusteCheque;

            const mesesAtraso = calcularMesesMulta(cheque.fechaEmision, fechaRectificatoria);
            let porcentajeMulta = tipoMultaAplicada === 'DURA'
                ? Math.min(0.60, 0.20 + (mesesAtraso > 1 ? (mesesAtraso - 1) * 0.02 : 0))
                : Math.min(0.30, 0.10 + (mesesAtraso > 1 ? (mesesAtraso - 1) * 0.02 : 0));

            const multaCheque = Math.round(baseRecargos * porcentajeMulta);
            const interesCheque = calcularInteresDiario(cheque.fechaEmision, fechaRectificatoria, baseRecargos);

            totalCapital += cheque.montoCobrado;
            totalReajuste += reajusteCheque;
            totalMulta += multaCheque;
            totalInteres += interesCheque;

            // Cálculo de Phi interno para este cheque
            if (canal === 'INTERNET') {
                const factorCondonacion = obtenerTasaCondonacion(mesesAtraso);
                // Phi = INT * CINT + MULTA * CMULT
                sumaPhi += (interesCheque * factorCondonacion) + (multaCheque * factorCondonacion);
            }
        });

        const recargos93 = totalMulta + totalInteres;
        let porcentaje60 = 0;
        let condonacion795 = 0;

        if (canal === 'INTERNET' && recargos93 > 0) {
            // [%] (Codigo 60) = ((Phi * 100) / [93]) * (1 - Vx010644)
            porcentaje60 = ((sumaPhi * 100) / recargos93) * factorV644;
            // Redondeamos el porcentaje a 2 decimales para evitar problemas de precisión flotante
            porcentaje60 = Math.round(porcentaje60 * 100) / 100;

            // [795] = ([93] * [60]) / 100
            condonacion795 = Math.round((recargos93 * porcentaje60) / 100);
        }

        giro291Data = {
            capital91: totalCapital,
            reajuste92: totalReajuste,
            recargos93: recargos93,
            condonacion795: condonacion795,
            porcentajeCondonacion60: porcentaje60,
            total94: totalCapital + totalReajuste + Math.max(0, recargos93 - condonacion795),
            tipoMultaAplicada,
            mesesAtrasoMulta: calcularMesesMulta(cheques[0]?.fechaEmision || fechaRectificatoria, fechaRectificatoria),
            montoDeflactadoTotal: totalCapital,
            subtotalInteresDiario: totalInteres,
            subtotalMultaMensual: totalMulta
        };
    }

    return { generaGiro295, generaGiro291, giro295: giro295Data, giro291: giro291Data };
}