// Archivo: src/App.tsx
import { useState } from 'react';
import { Home } from './components/Home';

// IMPORTS: Módulo Renta
import { AsistenteNOD } from './features/renta/components/AsistenteNOD';
import { MatrizNOD } from './features/renta/components/MatrizNOD';
import { FormularioIngreso } from './features/renta/components/FormularioIngreso';
import { VistaResultados } from './features/renta/components/VistaResultados';
import { evaluarObligacionNOD } from './features/renta/logic/evaluadorNOD';
import { calcularF22 } from './features/renta/logic/calculadoraF22';
import type { DatosFiltroNOD, ResultadoNOD } from './features/renta/logic/evaluadorNOD';
import type { DatosIngresoF22, ResultadoF22 } from './features/renta/logic/calculadoraF22';

// NUEVOS IMPORTS: Módulo Giros de Rectificatoria
import { FormularioGiros } from './features/giros_rectificatoria/components/FormularioGiros';
import { VistaResultadosGiros } from './features/giros_rectificatoria/components/VistaResultadosGiros';
import { calcularGiros } from './features/giros_rectificatoria/logic/calculadoraGiros';
import type { DatosIngresoGiros, ResultadoGiros } from './features/giros_rectificatoria/logic/tiposGiros';

// Ampliamos las etapas del flujo incluyendo la vista de resultados de Giros
type EtapaFlujo =
  | 'HOME'
  | 'FILTRO'
  | 'MATRIZ'
  | 'MULTAS_FORM'
  | 'MULTAS_RESULTADO'
  | 'LIBERADO'
  | 'GIROS_HOME'
  | 'GIROS_RESULTADO'; // <-- Nueva etapa

export default function App() {
  const [etapa, setEtapa] = useState<EtapaFlujo>('HOME');

  // Estados temporales: Módulo Renta
  const [datosFiltroPrevio, setDatosFiltroPrevio] = useState<any>(null);
  const [resultadoMultas, setResultadoMultas] = useState<ResultadoF22 | null>(null);
  const [mensajeLiberado, setMensajeLiberado] = useState<string>('');
  const [resultadoEvaluacionNOD, setResultadoEvaluacionNOD] = useState<ResultadoNOD | undefined>(undefined);

  // NUEVO ESTADO: Módulo Giros de Rectificatoria
  const [resultadoGiros, setResultadoGiros] = useState<ResultadoGiros | null>(null);

  // Manejador del menú principal
  const manejarSeleccionPrograma = (programa: 'RENTA' | 'GIROS') => {
    if (programa === 'RENTA') {
      setEtapa('FILTRO');
    } else {
      setEtapa('GIROS_HOME');
    }
  };

  // --- Transiciones: Módulo Renta ---
  const manejarFiltroEvaluado = (pasaFiltro: boolean, datos?: any) => {
    if (pasaFiltro && datos) {
      setDatosFiltroPrevio(datos);
      setEtapa('MATRIZ');
    } else {
      setEtapa('MULTAS_FORM');
    }
  };

  const manejarMatrizEvaluada = (datosCompletos: DatosFiltroNOD) => {
    const evaluar = evaluarObligacionNOD(datosCompletos);
    setResultadoEvaluacionNOD(evaluar);

    if (evaluar.obligadoADeclarar) {
      setEtapa('MULTAS_FORM');
    } else {
      setMensajeLiberado(evaluar.mensaje);
      setEtapa('LIBERADO');
    }
  };

  const manejarCalculoMultas = (datosEntrada: DatosIngresoF22) => {
    const calculos = calcularF22(datosEntrada);
    setResultadoMultas(calculos);
    setEtapa('MULTAS_RESULTADO');
  };

  // --- NUEVA TRANSICIÓN: Módulo Giros de Rectificatoria ---
  const manejarCalculoGiros = (datosEntrada: DatosIngresoGiros) => {
    const calculos = calcularGiros(datosEntrada);
    setResultadoGiros(calculos);
    setEtapa('GIROS_RESULTADO'); // Pasamos a ver la pantalla de auditoría de Giros
  };

  // Función global para limpiar estados y regresar al inicio
  const reiniciarSistema = () => {
    setEtapa('HOME');
    setDatosFiltroPrevio(null);
    setResultadoMultas(null);
    setMensajeLiberado('');
    setResultadoEvaluacionNOD(undefined);
    setResultadoGiros(null); // <-- Limpiamos el estado de Giros
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* MÓDULO HOME: SELECCIÓN INICIAL */}
        {etapa === 'HOME' && (
          <Home onSeleccionar={manejarSeleccionPrograma} />
        )}

        {/* ==================================================== */}
        {/* FLUJO 1: MULTAS E INTERESES DE RENTA                 */}
        {/* ==================================================== */}
        {etapa === 'FILTRO' && (
          <AsistenteNOD onFiltroEvaluado={manejarFiltroEvaluado} />
        )}

        {etapa === 'MATRIZ' && datosFiltroPrevio && (
          <MatrizNOD
            datosFiltro={datosFiltroPrevio}
            onEvaluarMatriz={manejarMatrizEvaluada}
            onVolver={reiniciarSistema}
          />
        )}

        {etapa === 'MULTAS_FORM' && (
          <FormularioIngreso
            onCalcular={manejarCalculoMultas}
            onVolver={reiniciarSistema}
          />
        )}

        {etapa === 'MULTAS_RESULTADO' && resultadoMultas && (
          <VistaResultados
            resultado={resultadoMultas}
            resultadoNOD={resultadoEvaluacionNOD}
            onVolver={reiniciarSistema}
          />
        )}

        {etapa === 'LIBERADO' && (
          <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl border-t-4 border-green-500 text-center">
            <h2 className="text-2xl font-black text-green-600 mb-4">¡Trámite Finalizado!</h2>
            <p className="text-gray-700 text-lg mb-8">{mensajeLiberado}</p>
            <button onClick={reiniciarSistema} className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition duration-200 uppercase">
              Volver al Inicio
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* FLUJO 2: GIROS DE RECTIFICATORIA                     */}
        {/* ==================================================== */}
        {etapa === 'GIROS_HOME' && (
          <FormularioGiros
            onCalcular={manejarCalculoGiros}
            onVolver={reiniciarSistema}
          />
        )}

        {etapa === 'GIROS_RESULTADO' && resultadoGiros && (
          <VistaResultadosGiros
            resultado={resultadoGiros}
            onVolver={reiniciarSistema}
          />
        )}

      </div>
    </div>
  );
}