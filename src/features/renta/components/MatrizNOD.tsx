// Archivo: src/components/MatrizNOD.tsx
import { useState } from 'react';
import type { DatosFiltroNOD } from '../logic/evaluadorNOD';
import { REGLAS_SII } from '../../../config/constantes';

// Omitimos los datos que ya vienen del filtro previo y el P01
type CamposMatriz = Omit<DatosFiltroNOD, 'codigo87' | 'codigo91' | 'tipo03' | 'vx010042' | 'P01'>;

interface Props {
    datosFiltro: { codigo87: number; codigo91: number; tipo03: number; vx010042: number; };
    onEvaluarMatriz: (datosCompletos: DatosFiltroNOD) => void;
    onVolver: () => void;
}

export function MatrizNOD({ datosFiltro, onEvaluarMatriz, onVolver }: Props) {
    // Inicializamos todos los campos en 0
    const [campos, setCampos] = useState<CamposMatriz>({
        codigo170: 0, codigo161: 0, codigo152: 0, codigo159: 0, codigo751: 0, codigo766: 0, codigo304: 0,
        codigo18: 0, codigo1109: 0, codigo1640: 0, codigo187: 0, codigo1037: 0,
        codigo201: 0, codigo79: 0, codigo825: 0, codigo114: 0, codigo909: 0, codigo952: 0, codigo755: 0,
        codigo134: 0, codigo1644: 0, codigo1135: 0, codigo1136: 0, codigo914: 0, codigo925: 0,
        codigo1048: 0, codigo1053: 0, codigo756: 0, codigo863: 0
    });

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCampos(prev => ({ ...prev, [name]: Number(value) }));
    };

    const enviarEvaluacion = (e: React.FormEvent) => {
        e.preventDefault();
        // Unimos los datos del paso 1, el P01 de las constantes y los campos actuales
        const datosCompletos: DatosFiltroNOD = {
            ...datosFiltro,
            ...campos,
            P01: REGLAS_SII.P01
        };
        onEvaluarMatriz(datosCompletos);
    };

    // Función auxiliar para renderizar inputs rápido
    const renderInput = (codigo: keyof CamposMatriz, label: string, permiteNegativos: boolean = false) => (
        <div key={codigo} className="flex flex-col">
            <label className="text-xs font-bold text-gray-600 mb-1">[{label}]</label>
            <input
                type="number"
                name={codigo}
                value={campos[codigo]}
                onChange={manejarCambio}
                className="px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 text-sm"
                min={permiteNegativos ? undefined : "0"}
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border-t-4 border-indigo-600">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Fase 2: Matriz de Evaluación NOD</h2>
            <p className="text-gray-600 mb-6 text-sm">
                Complete los códigos para evaluar los NOD. Deje en 0 los que no apliquen.
            </p>

            <form onSubmit={enviarEvaluacion} className="space-y-6">
                {/* Grupo 1: Rentas y Límites Base (NOD1, NOD3, NOD4) */}
                <div className="bg-gray-50 p-4 rounded border">
                    <h3 className="font-semibold text-indigo-800 mb-3 border-b pb-1">Base y Sueldos</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                        {renderInput('codigo170', '170')}
                        {renderInput('codigo161', '161')}
                        {renderInput('codigo152', '152')}
                        {renderInput('codigo159', '159')}
                        {renderInput('codigo751', '751')}
                        {renderInput('codigo766', '766')}
                        {renderInput('codigo304', '304', true)}
                    </div>
                </div>

                {/* Grupo 2: Límites P01 (NOD5) */}
                <div className="bg-gray-50 p-4 rounded border">
                    <h3 className="font-semibold text-indigo-800 mb-3 border-b pb-1">Validación NOD5</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {renderInput('codigo18', '18')}
                        {renderInput('codigo1109', '1109')}
                        {renderInput('codigo1640', '1640')}
                        {renderInput('codigo187', '187')}
                        {renderInput('codigo1037', '1037')}
                    </div>
                </div>

                {/* Grupo 3: Sumatoria General (NOD7) */}
                <div className="bg-gray-50 p-4 rounded border">
                    <h3 className="font-semibold text-indigo-800 mb-3 border-b pb-1">Sumatoria NOD7</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {renderInput('codigo201', '201')}
                        {renderInput('codigo79', '79')}
                        {renderInput('codigo825', '825')}
                        {renderInput('codigo114', '114')}
                        {renderInput('codigo909', '909')}
                        {renderInput('codigo952', '952')}
                        {renderInput('codigo755', '755')}
                        {renderInput('codigo134', '134')}
                        {renderInput('codigo1644', '1644')}
                        {renderInput('codigo1135', '1135')}
                        {renderInput('codigo1136', '1136')}
                        {renderInput('codigo914', '914')}
                        {renderInput('codigo925', '925')}
                        {renderInput('codigo1048', '1048')}
                        {renderInput('codigo1053', '1053')}
                        {renderInput('codigo756', '756')}
                        {renderInput('codigo863', '863')}
                    </div>
                </div>

                {/* Zona de Botones Actualizada */}
                <div className="flex flex-col space-y-3 mt-6">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition"
                    >
                        Ejecutar NOD
                    </button>
                    <button
                        type="button"
                        onClick={onVolver}
                        className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded hover:bg-gray-300 transition"
                    >
                        Volver al inicio
                    </button>
                </div>
            </form>
        </div>
    );
}