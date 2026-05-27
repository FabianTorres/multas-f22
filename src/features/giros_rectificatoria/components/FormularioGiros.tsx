// Archivo: src/features/giros_rectificatoria/components/FormularioGiros.tsx

import { useState } from 'react';
import type { DatosIngresoGiros, ChequeDevolucion, SetCodigosF22 } from '../logic/tiposGiros';



interface Props {
    onCalcular: (datos: DatosIngresoGiros) => void;
    onVolver: () => void;
}

export function FormularioGiros({ onCalcular, onVolver }: Props) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    const [canal, setCanal] = useState<'INTERNET' | 'INTRANET'>('INTERNET');
    const [tieneVector644, setTieneVector644] = useState<boolean>(false);

    // Estados Generales
    const [fechaRectificatoria, setFechaRectificatoria] = useState<string>(fechaHoy);
    const [evidCod, setEvidCod] = useState<string>('ONP'); // Por defecto 'Normal'

    // Estados de Declaraciones
    const [primitiva, setPrimitiva] = useState<SetCodigosF22>({ codigo91: 0, codigo87: 0, codigo161: 0, codigo162: 0 });
    const [rectificatoria, setRectificatoria] = useState<SetCodigosF22>({ codigo91: 0, codigo87: 0, codigo161: 0, codigo162: 0 });

    // Estado Dinámico de Cheques
    const [cheques, setCheques] = useState<ChequeDevolucion[]>([]);

    // Manejadores
    const manejarCambioPrimitiva = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrimitiva({ ...primitiva, [e.target.name]: Number(e.target.value) });
    };

    const manejarCambioRectificatoria = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRectificatoria({ ...rectificatoria, [e.target.name]: Number(e.target.value) });
    };

    const agregarCheque = () => {
        setCheques([
            ...cheques,
            { id: crypto.randomUUID(), fechaEmision: new Date(), montoCobrado: 0 }
        ]);
    };

    const eliminarCheque = (id: string) => {
        setCheques(cheques.filter(c => c.id !== id));
    };

    const actualizarCheque = (id: string, campo: keyof ChequeDevolucion, valor: any) => {
        setCheques(cheques.map(c => {
            if (c.id === id) {
                return { ...c, [campo]: campo === 'fechaEmision' ? new Date(valor + 'T00:00:00') : Number(valor) };
            }
            return c;
        }));
    };

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();
        onCalcular({
            evidCod,
            fechaRectificatoria: new Date(fechaRectificatoria + 'T00:00:00'),
            canal, tieneVector644,
            primitiva,
            rectificatoria,
            cheques
        });
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-xl border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wide border-b pb-2">
                Ingreso de Datos: Rectificatoria F22
            </h2>

            <form onSubmit={manejarEnvio} className="space-y-8">

                {/* SECCIÓN 1: DATOS GENERALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md border">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Rectificatoria (Hoy)</label>
                        <input type="date" value={fechaRectificatoria} onChange={(e) => setFechaRectificatoria(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Estado Primitiva [EVID_COD]</label>
                        <select value={evidCod} onChange={(e) => setEvidCod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                            <option value="ONP">ONP - Normal (Multa Blanda)</option>
                            <option value="IDG">IDG - Impugnada (Multa Dura)</option>
                            <option value="IGC">IGC - Impugnada (Multa Dura)</option>
                            <option value="RCO">RCO - Rectificatoria (Multa Blanda)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Vía de Presentación</label>
                        <select value={canal} onChange={(e) => setCanal(e.target.value as 'INTERNET' | 'INTRANET')} className="w-full px-3 py-2 border rounded-md">
                            <option value="INTERNET">Internet (Con Condonación)</option>
                            <option value="INTRANET">Intranet / Papel (Sin Condonación)</option>
                        </select>
                    </div>
                    <div className="flex items-center pt-6">
                        <input type="checkbox" id="v644" checked={tieneVector644} onChange={(e) => setTieneVector644(e.target.checked)} className="w-5 h-5 text-red-600 rounded" />
                        <label htmlFor="v644" className="ml-2 font-bold text-red-700 text-sm">Bloquear Condonación (Vector 644)</label>
                    </div>
                </div>

                {/* SECCIÓN 2: COMPARATIVA DE DECLARACIONES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Columna Primitiva */}
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100 shadow-sm">
                        <h3 className="font-bold text-blue-800 mb-4 text-center">F22 Primitiva (Anterior)</h3>
                        <div className="space-y-3">
                            <div><label className="text-xs font-bold text-gray-600">Pago [91]</label><input type="number" name="codigo91" min="0" value={primitiva.codigo91} onChange={manejarCambioPrimitiva} className="w-full px-2 py-1 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-600">Devolución [87]</label><input type="number" name="codigo87" min="0" value={primitiva.codigo87} onChange={manejarCambioPrimitiva} className="w-full px-2 py-1 border rounded" /></div>
                            <div className="pt-2 border-t border-blue-200"><label className="text-xs font-bold text-gray-600">Base Imponible [161]</label><input type="number" name="codigo161" value={primitiva.codigo161} onChange={manejarCambioPrimitiva} className="w-full px-2 py-1 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-600">Impto. 1ra Cat. [162]</label><input type="number" name="codigo162" value={primitiva.codigo162} onChange={manejarCambioPrimitiva} className="w-full px-2 py-1 border rounded" /></div>
                        </div>
                    </div>

                    {/* Columna Rectificatoria */}
                    <div className="bg-green-50 p-4 rounded-md border border-green-100 shadow-sm">
                        <h3 className="font-bold text-green-800 mb-4 text-center">F22 Rectificatoria (Nueva)</h3>
                        <div className="space-y-3">
                            <div><label className="text-xs font-bold text-gray-600">Pago [91]</label><input type="number" name="codigo91" min="0" value={rectificatoria.codigo91} onChange={manejarCambioRectificatoria} className="w-full px-2 py-1 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-600">Devolución [87]</label><input type="number" name="codigo87" min="0" value={rectificatoria.codigo87} onChange={manejarCambioRectificatoria} className="w-full px-2 py-1 border rounded" /></div>
                            <div className="pt-2 border-t border-green-200"><label className="text-xs font-bold text-gray-600">Base Imponible [161]</label><input type="number" name="codigo161" value={rectificatoria.codigo161} onChange={manejarCambioRectificatoria} className="w-full px-2 py-1 border rounded" /></div>
                            <div><label className="text-xs font-bold text-gray-600">Impto. 1ra Cat. [162]</label><input type="number" name="codigo162" value={rectificatoria.codigo162} onChange={manejarCambioRectificatoria} className="w-full px-2 py-1 border rounded" /></div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 3: CHEQUES / DEVOLUCIONES */}
                <div className="border border-gray-300 rounded-md p-4">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-gray-800">Historial de Devoluciones (Cheques / Depósitos)</h3>
                        <button type="button" onClick={agregarCheque} className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 transition">
                            + Agregar Devolución
                        </button>
                    </div>

                    {cheques.length === 0 ? (
                        <p className="text-sm text-gray-500 italic text-center py-4">No hay devoluciones ingresadas. Agregue una si la Primitiva generó un depósito.</p>
                    ) : (
                        <div className="space-y-3">
                            {cheques.map((cheque, index) => (
                                <div key={cheque.id} className="flex gap-4 items-end bg-gray-50 p-3 rounded border">
                                    <div className="font-bold text-gray-400 text-lg">#{index + 1}</div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-600">Monto Devuelto ($)</label>
                                        <input type="number" min="0" value={cheque.montoCobrado || ''} onChange={(e) => actualizarCheque(cheque.id, 'montoCobrado', e.target.value)} className="w-full px-2 py-1 border rounded" required />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-600">Fecha de Emisión TGR</label>
                                        <input type="date" value={cheque.fechaEmision.toISOString().split('T')[0]} onChange={(e) => actualizarCheque(cheque.id, 'fechaEmision', e.target.value)} className="w-full px-2 py-1 border rounded" required />
                                    </div>
                                    <button type="button" onClick={() => eliminarCheque(cheque.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-200">
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex space-x-4 pt-4">
                    <button type="button" onClick={onVolver} className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-md hover:bg-gray-300 transition-all uppercase text-sm">
                        Volver
                    </button>
                    <button type="submit" className="w-2/3 bg-green-600 text-white font-bold py-3 rounded-md shadow-lg hover:bg-green-700 hover:shadow-xl transition-all uppercase text-sm">
                        Evaluar Rectificatoria
                    </button>
                </div>

            </form>
        </div>
    );
}