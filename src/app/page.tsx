'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// // Import dynamique du composant 3D pour éviter les problèmes SSR
const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'))


interface Model {
  name: string
  url: string
  format?: 'ply' | 'drc'
  coordinates?: { x: number; y: number }
  fileSize?: number // Taille du fichier en octets
}

export default function HomePage() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Fonction pour récupérer la taille d'un fichier depuis S3
  const getFileSize = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return parseInt(response.headers.get('content-length') || '0')
    } catch {
      return 0
    }
  }

  // Fonction pour recharger les modèles (utilisée par le bouton Réessayer)
  const loadModels = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/models')
      if (!response.ok) throw new Error('Erreur lors du chargement des modèles')

      const modelsData = await response.json()

      // Récupérer les tailles des fichiers en parallèle
      const modelPromises = modelsData.map(async (modelData: { url: string; format: string; key: string }) => {
        const fileSize = await getFileSize(modelData.url)
        const name = modelData.url.split('/').pop() || 'Modèle'
        const nameWithoutExtension = name.replace('.final.ply', '').replace('.drc', '')
        
        return {
          name: nameWithoutExtension,
          url: modelData.url,
          format: modelData.format as 'ply' | 'drc',
          coordinates: extractCoordinates(modelData.url),
          fileSize
        }
      })

      const modelList = await Promise.all(modelPromises)
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
          <p className="mt-4 text-gray-600">Chargement...</p>
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
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Panneau de contrôle */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="card">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Modèles LiDAR</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner les modèles à afficher
                </label>
                <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto">
                  {models.map((model) => (
                    <label key={model.url} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(model.url)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedModels(prev => [...prev, model.url]);
                          } else {
                            setSelectedModels(prev => prev.filter(url => url !== model.url));
                          }
                        }}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm truncate">{model.name}</div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              model.format === 'drc'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {model.format?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          {model.coordinates && (
                            <div className="text-xs text-gray-500 truncate">
                              ({model.coordinates.x}, {model.coordinates.y})
                            </div>
                          )}
                          {model.fileSize && (
                            <div className="text-xs text-gray-600 font-mono">
                              {model.fileSize > 1024 * 1024
                                ? `${Math.round(model.fileSize / (1024 * 1024))}MB`
                                : `${Math.round(model.fileSize / 1024)}KB`
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedModels.length > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <span className="text-sm font-medium">
                      {selectedModels.length} modèle{selectedModels.length > 1 ? 's' : ''} sélectionné{selectedModels.length > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => setSelectedModels([])}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors self-start sm:self-auto"
                    >
                      Tout désélectionner
                    </button>
                  </div>
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
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="card h-[400px] sm:h-[500px] lg:h-[700px]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Visualiseur 3D</h2>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm px-3 py-2 touch-manipulation">
                  Contrôles
                </button>
                <button className="btn-secondary text-sm px-3 py-2 touch-manipulation">
                  Options
                </button>
              </div>
            </div>

            <div id="threejs-container" className="w-full h-[320px] sm:h-[420px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden">
              {selectedModels.length > 0 ? (
                <ThreeScene models={models} selectedModels={selectedModels} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center px-4">
                    <div className="animate-pulse text-gray-400 mb-4">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">Sélectionnez des modèles pour commencer la visualisation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}