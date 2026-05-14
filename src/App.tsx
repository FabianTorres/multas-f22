// Archivo: src/App.tsx
import { useState } from 'react';
import { AsistenteNOD } from './components/AsistenteNOD';
import { MatrizNOD } from './components/MatrizNOD';
import { FormularioIngreso } from './components/FormularioIngreso';
import { VistaResultados } from './components/VistaResultados';
import { evaluarObligacionNOD } from './logic/evaluadorNOD';
import { calcularF22 } from './logic/calculadoraF22';
import type { DatosFiltroNOD, ResultadoNOD } from './logic/evaluadorNOD';
import type { DatosIngresoF22, ResultadoF22 } from './logic/calculadoraF22';

// Definimos estrictamente las 5 pantallas posibles de nuestra aplicación
type EtapaFlujo = 'FILTRO' | 'MATRIZ' | 'MULTAS_FORM' | 'MULTAS_RESULTADO' | 'LIBERADO';

export default function App() {
  const [etapa, setEtapa] = useState<EtapaFlujo>('FILTRO');

  // Estados para almacenar datos temporales entre pantallas
  const [datosFiltroPrevio, setDatosFiltroPrevio] = useState<any>(null);
  const [resultadoMultas, setResultadoMultas] = useState<ResultadoF22 | null>(null);
  const [mensajeLiberado, setMensajeLiberado] = useState<string>('');
  const [resultadoEvaluacionNOD, setResultadoEvaluacionNOD] = useState<ResultadoNOD | undefined>(undefined);

  // 1. Transición desde el Filtro Previo
  const manejarFiltroEvaluado = (pasaFiltro: boolean, datos?: any) => {
    if (pasaFiltro && datos) {
      // Si cumple la condición estricta [87]>=0, etc... lo enviamos a la Matriz
      setDatosFiltroPrevio(datos);
      setEtapa('MATRIZ');
    } else {
      // Si no cumple el filtro, se salta los NOD y va directo a cobrar multas
      setEtapa('MULTAS_FORM');
    }
  };

  // 2. Transición desde la Matriz NOD
  const manejarMatrizEvaluada = (datosCompletos: DatosFiltroNOD) => {
    const evaluacion = evaluarObligacionNOD(datosCompletos);

    setResultadoEvaluacionNOD(evaluacion);

    if (evaluacion.obligadoADeclarar) {
      // La ecuación no dio 0. Debe pagar multa.
      setEtapa('MULTAS_FORM');
    } else {
      // La ecuación dio 0. El contribuyente se salva.
      setMensajeLiberado(evaluacion.mensaje);
      setEtapa('LIBERADO');
    }
  };

  // 3. Transición desde el Formulario de Multas
  const manejarCalculoMultas = (datosEntrada: DatosIngresoF22) => {
    const datosCalculados = calcularF22(datosEntrada);
    setResultadoMultas(datosCalculados);
    setEtapa('MULTAS_RESULTADO');
  };

  // Función global para reiniciar el sistema
  const reiniciarSistema = () => {
    setEtapa('FILTRO');
    setDatosFiltroPrevio(null);
    setResultadoMultas(null);
    setMensajeLiberado('');
    setResultadoEvaluacionNOD(undefined);

  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado global */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Fuera de plazo - Multas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Simulador de multas e intereses fuera de plazo para F22
          </p>
        </div>

        {/* MOTOR DE RENDERIZADO: Muestra la pantalla correcta según la etapa */}
        {etapa === 'FILTRO' && (
          <AsistenteNOD onFiltroEvaluado={manejarFiltroEvaluado} />
        )}

        {etapa === 'MATRIZ' && datosFiltroPrevio && (
          <MatrizNOD
            datosFiltro={datosFiltroPrevio}
            onEvaluarMatriz={manejarMatrizEvaluada}
            onVolver={reiniciarSistema} // <-- Agregado
          />
        )}

        {etapa === 'MULTAS_FORM' && (
          <FormularioIngreso
            onCalcular={manejarCalculoMultas}
            onVolver={reiniciarSistema} // <-- Agregado
          />
        )}

        {etapa === 'MULTAS_RESULTADO' && resultadoMultas && (
          <VistaResultados resultado={resultadoMultas}
            resultadoNOD={resultadoEvaluacionNOD}
            onVolver={reiniciarSistema} />
        )}

        {/* Pantalla especial para contribuyentes exentos (Ecuación NOD = 0) */}
        {etapa === 'LIBERADO' && (
          <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500 text-center">
            <h2 className="text-2xl font-black text-green-600 mb-4">¡Trámite Finalizado!</h2>
            <p className="text-gray-700 text-lg mb-8">{mensajeLiberado}</p>
            <button
              onClick={reiniciarSistema}
              className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition duration-200 uppercase"
            >
              Nueva Prueba
            </button>
          </div>
        )}

      </div>
    </div>
  );
}