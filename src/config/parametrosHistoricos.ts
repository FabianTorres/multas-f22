// Archivo: src/config/parametrosHistoricos.ts

export interface ParametrosMes {
    ipc: number;
    utm: number;
}

// El formato de la llave será "YYYY-MM" (Año y Mes)
export const VALORES_HISTORICOS: Record<string, ParametrosMes> = {
    "2026-01": { ipc: 109.71, utm: 69751 },
    "2026-02": { ipc: 109.70, utm: 69611 },
    "2026-03": { ipc: 110.75, utm: 69889 },
    "2026-04": { ipc: 112.18, utm: 69889 },
    "2026-05": { ipc: 0, utm: 70588 },
    "2026-06": { ipc: 0, utm: 71506 },
};