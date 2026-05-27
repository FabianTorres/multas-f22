// Archivo: src/components/AsistenteNOD.tsx
import { useState } from 'react';

// Estructura temporal para los datos del Filtro Previo
interface DatosFiltro {
    codigo87: number;
    codigo91: number;
    tipo03: number;
    vx010042: number;
}

interface Props {
    onFiltroEvaluado: (pasoFiltro: boolean, datosExtra?: DatosFiltro) => void;
}

export function AsistenteNOD({ onFiltroEvaluado }: Props) {
    // Estado para los 4 campos obligatorios del filtro inicial
    const [datos, setDatos] = useState<DatosFiltro>({
        codigo87: 0,
        codigo91: 0,
        tipo03: 1, // Por defecto 1 (Rut tipo 1)
        vx010042: 0,
    });

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos(prev => ({ ...prev, [name]: Number(value) }));
    };

    const evaluarFiltroPrevio = (e: React.FormEvent) => {
        e.preventDefault();

        // Lógica matemática exacta del PDF:
        // [87] >= 0 .y. [91] = 0 .y. TIPO{[03]}=1 .y. Vx010042 != 1
        const cumpleFiltro =
            datos.codigo87 >= 0 &&
            datos.codigo91 === 0 &&
            datos.tipo03 === 1 &&
            datos.vx010042 !== 1;

        // Enviamos el resultado hacia el componente padre (App.tsx)
        onFiltroEvaluado(cumpleFiltro, datos);
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border-t-4 border-indigo-600">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Fase 1: Filtro de Obligatoriedad</h2>
            <p className="text-gray-600 mb-6 text-sm">
                Ingrese los datos primarios para determinar si requiere evaluación NOD.
            </p>

            <form onSubmit={evaluarFiltroPrevio} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Código [87]</label>
                        <input
                            type="number"
                            name="codigo87"
                            value={datos.codigo87}
                            onChange={manejarCambio}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Código [91]</label>
                        <input
                            type="number"
                            name="codigo91"
                            value={datos.codigo91}
                            onChange={manejarCambio}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Tipo Rut [03]</label>
                        <input
                            type="number"
                            name="tipo03"
                            value={datos.tipo03}
                            onChange={manejarCambio}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Vector Vx010042</label>
                        <input
                            type="number"
                            name="vx010042"
                            value={datos.vx010042}
                            onChange={manejarCambio}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition"
                >
                    Siguiente Paso
                </button>
            </form>
        </div>
    );
}