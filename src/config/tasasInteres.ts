// Archivo: src/config/tasasInteres.ts

export interface TasaDiaria {
    tasaBaseAnual: number;
    tasaBaseDiaria: number;
    spreadAnual: number;
    spreadDiario: number;
    tasaTotalAnual: number;
    tasaTotalDiaria: number;
}

// Diccionario de tasas. La llave es la fecha en formato "DD-MM-YYYY"
export const TABLA_TASAS_DIARIAS: Record<string, TasaDiaria> = {
    "01-01-2025": { tasaBaseAnual: 4.62, tasaBaseDiaria: 0.000128333333, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 8.12, tasaTotalDiaria: 0.000225555556 },
    "02-01-2025": { tasaBaseAnual: 4.62, tasaBaseDiaria: 0.000128333333, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 8.12, tasaTotalDiaria: 0.000225555556 },
    // Faltan los demas 
    "22-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "23-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "24-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "25-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "26-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "27-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "28-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "29-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "30-04-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "01-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "02-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "03-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "04-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "05-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "06-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "07-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "08-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "09-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "10-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "11-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "12-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "13-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "14-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "15-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "16-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "17-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "18-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "19-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "20-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "21-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "22-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "23-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "24-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "25-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "26-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "27-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "28-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "29-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "30-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
    "31-05-2026": { tasaBaseAnual: 4.42, tasaBaseDiaria: 0.000122777778, spreadAnual: 3.5, spreadDiario: 0.000097222222, tasaTotalAnual: 7.92, tasaTotalDiaria: 0.000220000000 },
};
