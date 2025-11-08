import React, { createContext, useContext, useState, useEffect } from "react";
import { Leva, useControls, folder } from "leva";

// Création du Context pour partager l'état des contrôles
export const SceneControlsContext = createContext<{
  nuages: boolean;
  showBoundingBoxes: boolean;
  material: string;
  [key: string]: any;
}>({
  nuages: true,
  showBoundingBoxes: true,
  material: "standard",
});

function Params() {
  const debugControls = useControls("Debug", {
    showGrid: { value: true, label: "Grille" },
    showAxes: { value: false, label: "Axes" },
    showBoundingBoxes: { value: false, label: "Boîtes englobantes" },
    showStats: { value: false, label: "Statistiques" },
  });

  const lightControls = useControls("Éclairages", {
    showAmbientLight: { value: true, label: "Lumière ambiante" },
    ambientIntensity: {
      value: 0.3,
      min: 0,
      max: 1.5,
      step: 0.01,
      label: "Intensité ambiante",
      render: (get) => get("Éclairages.showAmbientLight"),
    },
    showDirectionalLight: { value: true, label: "Lumière directionnelle" },
    directionalIntensity: {
      value: 1.2,
      min: 0,
      max: 1.7,
      step: 0.01,
      label: "Intensité directionnelle",
      render: (get) => get("Éclairages.showDirectionalLight"),
    },
    sunAzimuth: {
      value: 120,
      min: 0,
      max: 360,
      step: 1,
      label: "Azimuth (°)",
      render: (get) => get("Éclairages.showDirectionalLight"),
    },
    sunElevation: {
      value: 45,
      min: 0,
      max: 90,
      step: 1,
      label: "Élévation (°)",
      render: (get) => get("Éclairages.showDirectionalLight"),
    },
  });

  const aspectControls = useControls("Aspect", {
    nuages: { value: true, label: "Nuages" },

    meshColor: { value: "#fff", label: "Couleur du mesh" },
    material: {
      value: "standard",
      options: ["standard", "normal",],
      label: "Matériau",
    },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.05, label: "Rugosité", render: (get) => get("Aspect.material") == "standard"},
    metalness: { value: 0.5, min: 0, max: 1, step: 0.05, label: "Métallicité", render: (get) => get("Aspect.material") == "standard" },
  });

  return { ...debugControls, ...lightControls, ...aspectControls };
}

export default function MyLevaUI({ children }: { children: React.ReactNode }) {
  const controlsValue = Params();

  return (
    <>
      <Leva
        hideCopyButton={true}
        flat={true}
        collapsed={true}
        titleBar={{
          // Configure title bar options
          title: "Paramètres", // Custom title
          drag: true, // Enable dragging
          filter: false, // Enable filter/search
          position: { x: 0, y: 0 }, // Initial position (when drag is enabled)
          onDrag: (position) => {}, // Callback when dragged
        }}
      />

      <SceneControlsContext.Provider value={controlsValue}>
        {children}
        {/* Le contexte est maintenant disponible pour tous les composants enfants */}
      </SceneControlsContext.Provider>
    </>
  );
}

// Hook personnalisé pour utiliser les contrôles de scène
export function useSceneControls() {
  return useContext(SceneControlsContext);
}
