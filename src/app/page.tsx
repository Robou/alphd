// 'use client'

// import { Canvas } from "@react-three/fiber";

// export default function App() {
// return (
//     <Canvas>
//       <mesh>
//         <sphereGeometry args={[3, 30, 30]} />
//         <meshNormalMaterial />
//       </mesh>
//       <ambientLight intensity={0.1} />
//       <directionalLight position={[0, 0, 5]} color="red" />
//     </Canvas>
// );
// }

'use client'

import { useState, useEffect } from 'react'
// import dynamic from 'next/dynamic'

// // Import dynamique du composant 3D pour éviter les problèmes SSR
// const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'))

interface Model {
  name: string
  url: string
  coordinates?: { x: number; y: number }
}

export default function HomePage() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Fonction pour recharger les modèles (utilisée par le bouton Réessayer)
  const loadModels = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/models')
      if (!response.ok) throw new Error('Erreur lors du chargement des modèles')

      const modelUrls = await response.json()
      const modelList: Model[] = modelUrls.map((url: string) => ({
        name: url.split('/').pop()?.replace('.nxz', '') || 'Modèle',
        url,
        coordinates: extractCoordinates(url)
      }))

      setModels(modelList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Charger la liste des modèles depuis l'API
  useEffect(() => {
    loadModels()
  }, [])

  // Extraire les coordonnées du nom de fichier
  const extractCoordinates = (filename: string) => {
    const match = filename.match(/(\d{4})_(\d{4})/)
    if (match) {
      return {
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10)
      }
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des modèles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <button onClick={loadModels} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Panneau de contrôle */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Modèles LiDAR</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner un modèle
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choisir un modèle...</option>
                  {models.map((model) => (
                    <option key={model.url} value={model.url}>
                      {model.name}
                      {model.coordinates && ` (${model.coordinates.x}, ${model.coordinates.y})`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedModel && (
                <div className="pt-4 border-t">
                  <button className="btn-primary w-full">
                    Charger le modèle
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-2">Statistiques</h3>
              <p className="text-sm text-gray-600">
                {models.length} modèles disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Zone de visualisation 3D */}
        {/* <div className="lg:col-span-3">
          <div className="card h-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Visualiseur 3D</h2>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">
                  Contrôles
                </button>
                <button className="btn-secondary text-sm">
                  Options
                </button>
              </div>
            </div>

            <div id="threejs-container" className="w-full h-[500px] bg-black rounded-lg overflow-hidden">
              {selectedModel ? (
                <ThreeScene modelUrl={selectedModel} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Sélectionnez un modèle pour commencer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}