// Archivo: src/components/FormularioIngreso.tsx
import { useState } from 'react';
import type { DatosIngresoF22 } from '../logic/calculadoraF22';

interface Props {
    onCalcular: (datos: DatosIngresoF22) => void;
    onVolver: () => void;
}

export function FormularioIngreso({ onCalcular, onVolver }: Props) {

    const fechaHoy = new Date().toISOString().split('T')[0];
    const [tcvig, setTcvig] = useState<string>('1');
    const [codigo305, setCodigo305] = useState<string>('0');
    const [vector644, setVector644] = useState<string>('0');
    const [fechaVencimiento, setFechaVencimiento] = useState<string>('2026-04-30'); // Ajustado a fin de mes por defecto
    const [fechaPago, setFechaPago] = useState<string>(fechaHoy); // [315] Fecha de presentación
    const [esDolares, setEsDolares] = useState<string>('false');

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();
        onCalcular({
            codigo305: Number(codigo305),
            vector644: Number(vector644),
            fechaVencimiento,
            fechaPago,
            esDolares: esDolares === 'true',
            tcvig: Number(tcvig)
        });
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Cálculo de Multas e Intereses</h2>

            <form onSubmit={manejarEnvio} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1 italic">Moneda [8811]</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                            value={esDolares}
                            onChange={(e) => setEsDolares(e.target.value)}
                        >
                            <option value="false">Pesos Chilenos (CLP)</option>
                            <option value="true">Dólares (US$)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Cambio [TCVIG]</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white transition-colors"
                            value={tcvig}
                            onChange={(e) => setTcvig(e.target.value)}
                            required
                        />
                        <p className="text-[10px] text-gray-400 mt-1 italic">Default: 1 para Moneda Nacional</p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Código [305]</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={codigo305}
                            onChange={(e) => setCodigo305(e.target.value)}
                            required
                        />
                    </div>

                    {/* ELIMINADA LA CAJA DE MULTA MANUAL, YA QUE AHORA ES AUTOMÁTICA */}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Vencimiento legal</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Presentación [315]</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={fechaPago} onChange={(e) => setFechaPago(e.target.value)} required />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1 italic">Vector [Vx010644]</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" value={vector644} onChange={(e) => setVector644(e.target.value)}>
                            <option value="0">0 (Permitir Condonación)</option>
                            <option value="1">1 (Bloquear Condonación)</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col space-y-3 mt-6">
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 uppercase">Calcular</button>
                    <button type="button" onClick={onVolver} className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-300 uppercase">Volver</button>
                </div>
            </form>
        </div>
    );
}