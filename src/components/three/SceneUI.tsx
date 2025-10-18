"use client";

import React, { useMemo } from "react";
import { Vector3, Box3 } from "three";

interface Model {
  name: string;
  url: string;
  coordinates?: { x: number; y: number };
}

interface SceneUIProps {
  models: Model[];
  selectedModels: string[];
}

export default function SceneUI({ models, selectedModels }: SceneUIProps) {
  const sceneInfo = useMemo(() => {
    if (selectedModels.length === 0) {
      return {
        modelCount: 0,
        boundingBox: null,
        totalArea: 0
      };
    }

    const boundingBox = calculateBoundingBox(models, selectedModels);

    if (!boundingBox) {
      return {
        modelCount: selectedModels.length,
        boundingBox: null,
        totalArea: 0
      };
    }

    const size = new Vector3();
    boundingBox.getSize(size);

    const center = new Vector3();
    boundingBox.getCenter(center);

    return {
      modelCount: selectedModels.length,
      boundingBox: {
        width: Math.round(size.x * 100) / 100,
        height: Math.round(size.y * 100) / 100,
        depth: Math.round(size.z * 100) / 100,
        center: {
          x: Math.round(center.x * 100) / 100,
          y: Math.round(center.y * 100) / 100,
          z: Math.round(center.z * 100) / 100
        }
      },
      totalArea: Math.round((size.x * size.z) * 100) / 100
    };
  }, [models, selectedModels]);

  return (
    <div className="absolute top-4 left-4 z-10 space-y-3">
      {/* Informations principales */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border min-w-[280px]">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Informations de la scène
        </h3>

        <div className="space-y-3">
          {/* Compteur de modèles */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Modèles sélectionnés:</span>
            <span className="text-lg font-bold text-blue-600">{sceneInfo.modelCount}</span>
          </div>

          {/* Bounding Box Info */}
          {sceneInfo.boundingBox && (
            <>
              <div className="border-t pt-3">
                <div className="text-xs text-gray-500 mb-2">Dimensions (unités):</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-500">Largeur</div>
                    <div className="font-mono font-medium">{sceneInfo.boundingBox.width}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-500">Hauteur</div>
                    <div className="font-mono font-medium">{sceneInfo.boundingBox.height}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <div className="text-gray-500">Profondeur</div>
                    <div className="font-mono font-medium">{sceneInfo.boundingBox.depth}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-xs text-gray-500 mb-2">Centre (x, y, z):</div>
                <div className="font-mono text-xs bg-gray-50 p-3 rounded">
                  {sceneInfo.boundingBox.center.x}, {sceneInfo.boundingBox.center.y}, {sceneInfo.boundingBox.center.z}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Surface totale:</span>
                  <span className="font-mono text-sm font-medium">{sceneInfo.totalArea} unités²</span>
                </div>
              </div>
            </>
          )}

          {/* Espace réservé pour futures informations */}
          <div className="border-t pt-3">
            <div className="text-xs text-gray-400 italic">
              Espace réservé pour d'autres informations...
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de contrôles rapide */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Contrôles rapides</h4>
        <div className="space-y-1">
          <button className="w-full text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors">
            Centrer la vue
          </button>
          <button className="w-full text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded transition-colors">
            Vue de dessus
          </button>
        </div>
      </div>
    </div>
  );
}

// Fonction pour calculer la bounding box de tous les modèles sélectionnés
function calculateBoundingBox(models: Model[], selectedModels: string[]): Box3 | null {
  if (selectedModels.length === 0) return null;

  const box = new Box3();
  let hasValidModel = false;

  models.forEach(model => {
    if (selectedModels.includes(model.url) && model.coordinates) {
      // Chaque modèle fait 1 unité de côté
      const modelSize = 1;
      const halfSize = modelSize / 2;

      // Créer une bounding box pour ce modèle
      const modelBox = new Box3(
        new Vector3(
          model.coordinates.x * 1 - halfSize,
          -halfSize,
          model.coordinates.y * 1 - halfSize
        ),
        new Vector3(
          model.coordinates.x * 1 + halfSize,
          halfSize,
          model.coordinates.y * 1 + halfSize
        )
      );

      box.union(modelBox);
      hasValidModel = true;
    }
  });

  return hasValidModel ? box : null;
}