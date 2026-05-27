export function Home({ onSeleccionar }: { onSeleccionar: (programa: 'RENTA' | 'GIROS') => void }) {
    return (
        <div className="max-w-4xl mx-auto mt-20 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900">Giros Renta</h1>
                <p className="mt-4 text-lg text-gray-600">Selecciona el módulo a evaluar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tarjeta Programa 1 */}
                <button
                    onClick={() => onSeleccionar('RENTA')}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Multas e Intereses Primitiva</h2>
                    <p className="text-gray-600">Evaluación NOD y cálculos de recargos por presentación fuera de plazo.</p>
                </button>

                {/* Tarjeta Programa 2 */}
                <button
                    onClick={() => onSeleccionar('GIROS')}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-600 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Giros de Rectificatoria</h2>
                    <p className="text-gray-600">Cálculo de giros por diferencias de impuestos y giros por reintegro.</p>
                </button>
            </div>
        </div>
    );
}