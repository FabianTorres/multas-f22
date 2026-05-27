// Archivo: src/components/VistaResultados.tsx
import type { ResultadoF22 } from '../logic/calculadoraF22';
import type { ResultadoNOD } from '../logic/evaluadorNOD';

interface Props {
    resultado: ResultadoF22;
    resultadoNOD?: ResultadoNOD;
    onVolver: () => void;
}

export function VistaResultados({ resultado, resultadoNOD, onVolver }: Props) {
    const formatoMoneda = (valor: number) =>
        new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(valor);

    const au = resultado.auditoria; // Atajo para no escribir tanto

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl border-t-4 border-blue-600">

            {/* --- SECCIÓN 1: RESULTADOS PARA EL CONTRIBUYENTE */}
            <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-wider text-center border-b pb-2">
                Cálculos
            </h2>
            <div className="space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">MONTO IMPUESTO [91]</span>
                    <span className="font-bold text-gray-900">{formatoMoneda(resultado.codigo91)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">REAJUSTES [92]</span>
                    <span className="font-bold text-gray-900">{formatoMoneda(resultado.codigo92)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">INTERESES Y MULTAS [93]</span>
                    <span className="font-bold text-gray-900">{formatoMoneda(resultado.codigo93)}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-md my-4 border border-blue-100">
                    <div className="flex justify-between items-center text-blue-800 mb-1">
                        <span className="text-sm font-semibold uppercase">Condonación [795]</span>
                        <span className="font-bold">{formatoMoneda(resultado.codigo795)}</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-600 text-xs">
                        <span>FACTOR DE CONDONACIÓN[60]</span>
                        <span className="font-bold">{resultado.codigo60}%</span>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-gray-900 p-4 rounded-md mt-6">
                    <span className="text-white font-black text-lg uppercase">Total a Pagar [94]</span>
                    <span className="text-yellow-400 font-black text-2xl">{formatoMoneda(resultado.codigo94)}</span>
                </div>
            </div>

            {/* --- SECCIÓN 2: PANEL DE AUDITORÍA QA */}
            <div className="mt-12 bg-gray-900 rounded-lg overflow-hidden shadow-inner font-mono text-xs text-green-400">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between">
                    <span className="font-bold text-gray-200 uppercase tracking-widest">Revisión en detalle de algortimos y calculos</span>

                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-gray-400 border-b border-gray-700 mb-2 uppercase">Funciones</h4>
                            <ul className="space-y-1">
                                <li>NMES (Meses Atraso): <span className="text-white">{resultado.mesesAtraso}</span></li>
                                <li>IPC Mes Ante Anterior: <span className="text-white">{au.tiempo.ipcMesAnterior}</span></li>
                                <li>IPC (02/AT): <span className="text-white">{au.tiempo.ipcFebrero}</span></li>
                                <li>REAJ: <span className="text-white">{au.tiempo.reaj}</span></li>
                                <li>UTM Aplicada: <span className="text-white">${au.tiempo.utm}</span></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-gray-400 border-b border-gray-700 mb-2 uppercase">Factores y Tasas</h4>
                            <ul className="space-y-1">
                                <li>Σ Int Base (4 decimales): <span className="text-white">{au.sumatorias.intBase.toFixed(4)}</span></li>
                                <li>Σ Int Spread (4 decimales): <span className="text-white">{au.sumatorias.intSpread.toFixed(4)}</span></li>
                                <li>MULTA: <span className="text-white">{(au.factores.multaMinima * 100).toFixed(0)}%</span></li>
                                <li className="pt-1 text-gray-500">--- Condonación ---</li>
                                <li>[CMUL]: <span className="text-white">{au.factores.cmul}</span></li>
                                <li>[CINT_base]: <span className="text-white">{au.factores.cintBase}</span></li>
                                <li>[CINT_spread]: <span className="text-white">{au.factores.cintSpread}</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4 bg-gray-800 p-3 rounded border border-gray-700">

                        <h4 className="text-yellow-500 border-b border-gray-600 mb-2 uppercase font-bold">Constantes y variables</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-gray-400">[ p ] (Base + P30):</span>
                                <span className="text-white">{au.constantes.p.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-400">[ a ] (Multa Fija):</span>
                                <span className="text-white">{au.constantes.a}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-400">[ b ] (Reajuste):</span>
                                <span className="text-white">{au.constantes.b.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between mt-2">
                                <span className="text-gray-300 font-semibold">[ d ] (Total Multas e Int.):</span>
                                <span className="text-white font-semibold">{au.constantes.d}</span>
                            </li>
                            <li className="flex justify-between pl-4 border-l-2 border-gray-700 ml-1">
                                <span className="text-gray-500 text-xs">&#x21B3; Subtotal Multa:</span>
                                <span className="text-gray-400 text-xs">{au.constantes.d_multa}</span>
                            </li>
                            <li className="flex justify-between pl-4 border-l-2 border-gray-700 ml-1 mb-2">
                                <span className="text-gray-500 text-xs">&#x21B3; Subtotal Intereses:</span>
                                <span className="text-gray-400 text-xs">{au.constantes.d_intereses}</span>
                            </li>
                            <li className="flex justify-between pt-2 border-t border-gray-600">
                                <span className="text-blue-400 font-bold">[ φ ] (Phi - Condonado):</span>
                                <span className="text-blue-300 font-bold">{au.constantes.phi}</span>
                            </li>
                        </ul>
                        {/* --- NUEVO BLOQUE: MATRIZ NOD --- */}
                        {resultadoNOD && resultadoNOD.auditoria && (
                            <div className="bg-gray-800 p-3 rounded border border-gray-700">
                                <h4 className="text-purple-400 border-b border-gray-600 mb-2 uppercase font-bold">Matriz NOD</h4>
                                <ul className="space-y-1 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">[NOD1]:</span> <span className="text-white">{resultadoNOD.auditoria.NOD1}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">[NOD3]:</span> <span className="text-white">{resultadoNOD.auditoria.NOD3}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">[NOD4]:</span> <span className="text-white">{resultadoNOD.auditoria.NOD4}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">[NOD5]:</span> <span className="text-white">{resultadoNOD.auditoria.NOD5}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">[NOD7]:</span> <span className="text-white">{resultadoNOD.auditoria.NOD7}</span>
                                    </li>
                                    <li className="flex justify-between pt-2 mt-1 border-t border-gray-600">
                                        <span className="text-purple-300 font-bold">Ecuación NOD:</span>
                                        <span className="text-purple-300 font-bold">{resultadoNOD.auditoria.ecuacionMaestra}</span>
                                    </li>
                                </ul>
                                <div className={`mt-3 p-2 rounded text-center text-[10px] uppercase font-bold tracking-wider ${resultadoNOD.obligadoADeclarar ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                                    {resultadoNOD.obligadoADeclarar ? "Status: Obligado a Declarar" : "Status: No Obligado a Declarar"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={onVolver} className="mt-8 w-full max-w-lg mx-auto block border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-md hover:bg-gray-50 transition-all uppercase text-sm">
                Nueva Evaluación
            </button>
        </div>
    );
}