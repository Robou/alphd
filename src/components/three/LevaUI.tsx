import React, { createContext, useContext, useState, useEffect } from 'react'
import { useControls } from 'leva'

// Création du Context pour partager l'état des contrôles
export const SceneControlsContext = createContext<{
  nuages: boolean;
  [key: string]: any;
}>({
  nuages: true,
});

function Params() {
  const controls = useControls(
    'Options',
    {
        nuages: true,
        // Ajoutez d'autres options ici
        // exemple: showGrid: true,
        // exemple: showAxes: true,
    }
  )

  // État local pour forcer les re-renders
  const [controlsState, setControlsState] = useState(controls);

  // Mettre à jour l'état local quand les contrôles changent
  useEffect(() => {
    setControlsState(controls);
  }, [controls.nuages]);

  return controlsState;
}

export default function MyLevaUI() {
  const controlsValue = Params();

  return (
    <SceneControlsContext.Provider value={controlsValue}>
      {/* Le contexte est maintenant disponible pour tous les composants enfants */}
    </SceneControlsContext.Provider>
  )
}

// Hook personnalisé pour utiliser les contrôles de scène
export function useSceneControls() {
  return useContext(SceneControlsContext);
}