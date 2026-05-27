// Archivo sugerido: src/features/giros_rectificatoria/logic/tiposGiros.ts

export interface ChequeDevolucion {
    id: string;          // Identificador interno para React
    fechaEmision: Date;  // Fecha en que la TGR depositó/emitió el cheque
    montoCobrado: number; // Monto histórico real recibido por el contribuyente
}

// Agrupamos los códigos relevantes para poder comparar Primitiva vs Rectificatoria
export interface SetCodigosF22 {
    codigo91: number;    // Impuesto a pagar
    codigo87: number;    // Saldo a favor (Devolución)
    codigo161: number;   // Base imponible (Para cálculo de condonación)
    codigo162: number;   // Impuesto de primera categoría (Para cálculo de condonación)
    // ¿Falta algún otro código específico para la condonación de rectificatorias?
}

export interface DatosIngresoGiros {
    evidCod: string;                  // Ej: "IDG" (Impugnada), "ONP" (Normal)
    fechaRectificatoria: Date;        // Fecha en que el QA ejecuta la prueba
    canal: 'INTERNET' | 'INTRANET';   // <-- NUEVO
    tieneVector644: boolean;          // <-- NUEVO

    primitiva: SetCodigosF22;         // Lo que el contribuyente declaró originalmente
    rectificatoria: SetCodigosF22;    // La nueva verdad tributaria

    cheques: ChequeDevolucion[];      // Lista dinámica (pueden ser 0, 1 o varios)
}

// Estructura de salida (Lo que el motor le devolverá a la pantalla negra de QA)
export interface ResultadoGiros {
    generaGiro295: boolean;
    generaGiro291: boolean;

    giro295?: {
        capital91: number;
        reajuste92: number;
        interes93: number;
        total94: number;
        condonacion795: number;
        diferenciaCalculada: number;
        diasAtraso: number;
    };

    giro291?: {
        capital91: number;
        reajuste92: number;
        recargos93: number;
        total94: number;
        condonacion795: number;
        porcentajeCondonacion60: number;
        tipoMultaAplicada: 'DURA' | 'BLANDA';
        mesesAtrasoMulta: number;
        montoDeflactadoTotal: number;
        subtotalInteresDiario: number;
        subtotalMultaMensual: number;
    };
}