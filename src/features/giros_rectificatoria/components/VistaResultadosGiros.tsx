// Archivo: src/features/giros_rectificatoria/components/VistaResultadosGiros.tsx

import type { ResultadoGiros } from '../logic/tiposGiros';

interface Props {
    resultado: ResultadoGiros;
    onVolver: () => void;
}

export function VistaResultadosGiros({ resultado, onVolver }: Props) {
    const formatearDinero = (monto: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto);
    };

    const sinGiros = !resultado.generaGiro295 && !resultado.generaGiro291;

    return (
        <div className="max-w-4xl mx-auto mt-8 bg-gray-900 p-8 rounded-lg shadow-2xl border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase">
                    Resultado de Rectificatoria
                </h2>
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    Giros
                </span>
            </div>

            {sinGiros && (
                <div className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No se generaron Giros</h3>
                    <p className="text-gray-500">
                        La rectificatoria no generó diferencias de impuestos a pagar ni reintegros.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* TARJETA GIRO [295] - DIFERENCIA DE IMPUESTOS */}
                {resultado.generaGiro295 && resultado.giro295 && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="bg-blue-900/50 p-4 border-b border-gray-700">
                            <h3 className="text-lg font-bold text-blue-400">Giro [295]</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Diferencia de Impuestos</p>
                        </div>
                        <ul className="p-4 space-y-3 font-mono text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-400">[91] Pago:</span>
                                <span className="text-white">{formatearDinero(resultado.giro295.capital91)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-400">[92] Reajuste IPC:</span>
                                <span className="text-white">{formatearDinero(resultado.giro295.reajuste92)}</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-700 pb-3">
                                <span className="text-gray-400">[93] Interés Diario:</span>
                                <span className="text-white">{formatearDinero(resultado.giro295.interes93)}</span>
                            </li>
                            <li className="flex justify-between pt-1 text-green-400 font-bold">
                                <span>[795] Condonación:</span>
                                <span>- {formatearDinero(resultado.giro295.condonacion795)}</span>
                            </li>
                            <li className="flex justify-between pt-4 mt-2 border-t-2 border-gray-600 text-lg font-black text-white">
                                <span>[94] Total a Pagar:</span>
                                <span>{formatearDinero(resultado.giro295.total94)}</span>
                            </li>
                        </ul>
                    </div>
                )}

                {/* TARJETA GIRO [291] - REINTEGRO */}
                {resultado.generaGiro291 && resultado.giro291 && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="bg-red-900/40 p-4 border-b border-gray-700">
                            <h3 className="text-lg font-bold text-red-400">Giro [291]</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Reintegro de Devolución</p>
                        </div>
                        <ul className="p-4 space-y-3 font-mono text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-400">[91] Pago:</span>
                                <span className="text-white">{formatearDinero(resultado.giro291.capital91)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-400">[92] Reajuste IPC:</span>
                                <span className="text-white">{formatearDinero(resultado.giro291.reajuste92)}</span>
                            </li>

                            {/* Desglose del 93 */}
                            <li className="flex justify-between pt-2">
                                <span className="text-gray-300 font-semibold">[93] Recargos Totales:</span>
                                <span className="text-white font-semibold">{formatearDinero(resultado.giro291.recargos93)}</span>
                            </li>
                            <li className="flex justify-between pl-4 border-l-2 border-gray-700 ml-1">
                                <span className="text-gray-500 text-xs">&#x21B3; Multa {resultado.giro291.tipoMultaAplicada}:</span>
                                <span className="text-gray-400 text-xs">{formatearDinero(resultado.giro291.subtotalMultaMensual)}</span>
                            </li>
                            <li className="flex justify-between pl-4 border-l-2 border-gray-700 ml-1 mb-2">
                                <span className="text-gray-500 text-xs">&#x21B3; Interés Diario:</span>
                                <span className="text-gray-400 text-xs">{formatearDinero(resultado.giro291.subtotalInteresDiario)}</span>
                            </li>

                            <li className="flex justify-between pt-2 text-green-400 font-bold border-t border-gray-700 mt-2">
                                <span>[795] Condonación ({resultado.giro291.porcentajeCondonacion60}%):</span>
                                <span>- {formatearDinero(resultado.giro291.condonacion795)}</span>
                            </li>
                            <li className="flex justify-between pt-4 mt-2 border-t-2 border-gray-600 text-lg font-black text-white">
                                <span>[94] Total a Pagar:</span>
                                <span>{formatearDinero(resultado.giro291.total94)}</span>
                            </li>
                        </ul>
                    </div>
                )}

            </div>


            {/* SECCIÓN DE AUDITORÍA (DETALLE DE CÁLCULO) */}
            {(!sinGiros) && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700 font-mono text-sm">
                    <h3 className="text-yellow-500 font-bold uppercase tracking-widest border-b border-gray-600 pb-2 mb-4">
                        Variables de Motor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Variables de Diferencia [295] */}
                        {resultado.generaGiro295 && resultado.giro295 ? (
                            <div>
                                <h4 className="text-blue-400 font-bold mb-2 uppercase text-xs">Detalle Giro [295]</h4>
                                <ul className="space-y-1">
                                    <li className="flex justify-between text-gray-400 border-b border-gray-700 pb-1">
                                        <span>Base:</span>
                                        <span className="text-white">{resultado.giro295.diferenciaCalculada}</span>
                                    </li>
                                    <li className="flex justify-between text-gray-400 border-b border-gray-700 py-1">
                                        <span>Total Interés (Sin Condonar):</span>
                                        <span className="text-white">{resultado.giro295.interes93}</span>
                                    </li>
                                    <li className="flex justify-between text-gray-400 pt-1">
                                        <span>Cálculo Condonación [795]:</span>
                                        <span className="text-white">{resultado.giro295.condonacion795}</span>
                                    </li>
                                </ul>
                            </div>
                        ) : <div />}

                        {/* Variables de Reintegro [291] */}
                        {resultado.generaGiro291 && resultado.giro291 ? (
                            <div>
                                <h4 className="text-red-400 font-bold mb-2 uppercase text-xs">Detalle Giro [291]</h4>
                                <ul className="space-y-1">
                                    <li className="flex justify-between text-gray-400 border-b border-gray-700 pb-1">
                                        <span>Tipo de Multa Aplicada:</span>
                                        <span className="text-white font-bold">{resultado.giro291.tipoMultaAplicada}</span>
                                    </li>
                                    <li className="flex justify-between text-gray-400 border-b border-gray-700 py-1">
                                        <span>Suma Deflactada Cheques:</span>
                                        <span className="text-white">{formatearDinero(resultado.giro291.montoDeflactadoTotal)}</span>
                                    </li>
                                    <li className="flex justify-between text-gray-400 border-b border-gray-700 py-1">
                                        <span>Meses Castigo (Cheque 1):</span>
                                        <span className="text-white">{resultado.giro291.mesesAtrasoMulta}</span>
                                    </li>
                                    <li className="flex justify-between text-gray-400 border-b border-gray-700 py-1">
                                        <span>Código [60] (%):</span>
                                        <span className="text-white">{resultado.giro291.porcentajeCondonacion60}%</span>
                                    </li>
                                    <li className="flex justify-between text-gray-400 pt-1">
                                        <span>Cálculo Condonación [795]:</span>
                                        <span className="text-white">{resultado.giro291.condonacion795}</span>
                                    </li>
                                </ul>
                            </div>
                        ) : <div />}

                    </div>
                </div>
            )}
            {/* --- FIN DEL BLOQUE NUEVO --- */}




            <div className="mt-10 flex justify-center">
                <button
                    onClick={onVolver}
                    className="w-full md:w-1/2 bg-gray-700 text-white font-bold py-4 rounded-md shadow-lg hover:bg-gray-600 transition duration-200 uppercase tracking-widest"
                >
                    Finalizar y Volver al Menú
                </button>
            </div>
        </div>
    );
}