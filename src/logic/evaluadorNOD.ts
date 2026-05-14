// Archivo: src/logic/evaluadorNOD.ts

export interface DatosFiltroNOD {
    // Filtro previo
    codigo87: number; codigo91: number; tipo03: number; vx010042: number;
    // Parámetro
    P01: number;
    // Rentas
    codigo170: number; codigo161: number; codigo152: number; codigo159: number; codigo751: number; codigo766: number; codigo304: number;
    // Límites P01
    codigo18: number; codigo1109: number; codigo1640: number; codigo187: number; codigo1037: number;
    // Sumatoria
    codigo201: number; codigo79: number; codigo825: number; codigo114: number; codigo909: number; codigo952: number; codigo755: number;
    codigo134: number; codigo1644: number; codigo1135: number; codigo1136: number; codigo914: number; codigo925: number;
    codigo1048: number; codigo1053: number; codigo756: number; codigo863: number;
}

export interface ResultadoNOD {
    obligadoADeclarar: boolean;
    mensaje: string;
    // Rastro de auditoría
    auditoria?: {
        NOD1: number;
        NOD3: number;
        NOD4: number;
        NOD5: number;
        NOD7: number;
        ecuacionMaestra: number;
    };
}

// ==========================================
// CAPA 1: ALGORITMOS NOD (Según Pág. 1 y 2 del PDF)
// ==========================================

// [NOD1] = 0 si [170] <= 13,5 * P01 ; 1 si no
function calcNOD1(c170: number, P01: number): number {
    return c170 <= (13.5 * P01) ? 0 : 1;
}

// [NOD3] = [170] - ([161] + [152] + [159] - [751] - [766]) = 0 ? 0 : 1
function calcNOD3(c170: number, c161: number, c152: number, c159: number, c751: number, c766: number): number {
    const operacion = c170 - (c161 + c152 + c159 - c751 - c766);
    return operacion === 0 ? 0 : 1;
}

// [NOD4] = [170] = [161] .y. [304] = 0 .y. [87] = [91] ? 0 : 1
function calcNOD4(c170: number, c161: number, c304: number, c87: number, c91: number): number {
    return (c170 === c161 && c304 === 0 && c87 === c91) ? 0 : 1;
}

// [NOD5] = Evalúa límites individuales contra P01
function calcNOD5(c18: number, c1109: number, c1640: number, c187: number, c1037: number, P01: number): number {
    const cumpleTodos = c18 <= P01 && c1109 <= P01 && c1640 <= P01 && c187 <= P01 && c1037 <= P01;
    return cumpleTodos ? 0 : 1;
}

// [NOD7] = Sumatoria > 0 ? 1 : 0
function calcNOD7(sumatoria: number): number {
    return sumatoria > 0 ? 1 : 0;
}


// ==========================================
// CAPA 2: EVALUADOR PRINCIPAL (FILTRO Y ECUACIÓN)
// ==========================================

export function evaluarObligacionNOD(datos: DatosFiltroNOD): ResultadoNOD {

    // 1. EL FILTRO PREVIO (Pág. 1)
    const cumpleFiltroPrevio =
        datos.codigo87 >= 0 &&
        datos.codigo91 === 0 &&
        datos.tipo03 === 1 &&
        datos.vx010042 !== 1;

    if (!cumpleFiltroPrevio) {
        return { obligadoADeclarar: true, mensaje: "No cumple filtro previo. Se realizan cálculos de intereses y multas." };
    }

    // 2. EJECUCIÓN DE ALGORITMOS
    const NOD1 = calcNOD1(datos.codigo170, datos.P01);
    const NOD3 = calcNOD3(datos.codigo170, datos.codigo161, datos.codigo152, datos.codigo159, datos.codigo751, datos.codigo766);
    const NOD4 = calcNOD4(datos.codigo170, datos.codigo161, datos.codigo304, datos.codigo87, datos.codigo91);
    const NOD5 = calcNOD5(datos.codigo18, datos.codigo1109, datos.codigo1640, datos.codigo187, datos.codigo1037, datos.P01);

    const sumatoriaNOD7 =
        datos.codigo201 + datos.codigo79 + datos.codigo825 + datos.codigo114 + datos.codigo909 +
        datos.codigo952 + datos.codigo755 + datos.codigo134 + datos.codigo1644 + datos.codigo1135 +
        datos.codigo1136 + datos.codigo914 + datos.codigo925 + datos.codigo1048 + datos.codigo1053 +
        datos.codigo756 + datos.codigo863;
    const NOD7 = calcNOD7(sumatoriaNOD7);

    // 3. LA ECUACIÓN MAESTRA (Pág. 2)
    // No se aplica multa si: ([NOD1]*[NOD3]*[NOD4]) + [NOD5] + [NOD7] = 0
    const ecuacionMaestra = (NOD1 * NOD3 * NOD4) + NOD5 + NOD7;

    const paqueteAuditoria = {
        NOD1, NOD3, NOD4, NOD5, NOD7, ecuacionMaestra
    };

    if (ecuacionMaestra === 0) {
        return {
            obligadoADeclarar: false,
            mensaje: "Contribuyente No Obligado a Declarar (Matriz NOD = 0).",
            auditoria: paqueteAuditoria
        };
    } else {
        return {
            obligadoADeclarar: true,
            mensaje: `Obligado a declarar. Ecuación Maestra arrojó valor > 0.`,
            auditoria: paqueteAuditoria
        };
    }
}