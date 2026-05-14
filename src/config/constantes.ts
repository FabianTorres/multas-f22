// Archivo: src/config/constantes.ts

export const REGLAS_SII = {
    // Parámetros Fijos del Formulario
    P30_FACTOR: 0.012, // 1.2%
    P01: 834504,
    ANIO_TRIBUTARIO: 2026,

    // Reglas de negocio deducidas de la web
    MULTA_PRIMER_MES_FACTOR: 0.10, // 10% de multa sobre la base
    CONDONACION_INTERNET_FACTOR: 0.70, // 70% de rebaja en multas e intereses

    // Por ahora, como es pago en abril, el reajuste e interés diario es 0.
    // Los dejamos aquí por si el proyecto escala a meses futuros.
    REAJUSTE_ABRIL_FACTOR: 0,
    INTERES_DIARIO_ABRIL: 0
};