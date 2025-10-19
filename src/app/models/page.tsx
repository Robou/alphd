// export default function ModelsList() {
//     return ( <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//             <p>Liste des modèles disponibles...</p>
//             <p>Page en construction</p>
          
//         </div>
//       </div>)
// }

'use client'

import { Canvas } from '@react-three/fiber'
import Polyhedron from './Polyhedron.jsx'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'

export default function App() {
  const polyhedron = [
    new THREE.BoxGeometry(),
    new THREE.SphereGeometry(0.785398),
    new THREE.DodecahedronGeometry(0.785398),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section avec image d'arrière-plan */}
      <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://raw.githubusercontent.com/Robou/LidarHD/main/images/FontSancte/332_3.jpg"
            alt="Montagne 3D reconstruite en haute définition"
            className="h-full w-full object-cover"
          />
          {/* Overlay avec gradient pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        </div>

        {/* Titre de la section */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Modèles 3D
            </h1>
            <p className="text-sm sm:text-base text-white/90 mt-2">
              Exploration interactive des modèles de montagne
            </p>
          </div>
        </div>
      </div>

      {/* Zone du canvas Three.js */}
      <div className="container mx-auto px-6 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Visualiseur de modèles
            </h2>
            <p className="text-sm text-gray-600">
              Utilisez les contrôles tactiles ou la souris pour explorer les modèles 3D
            </p>
          </div>

          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 3] }} className="w-full h-full">
              <Polyhedron position={[-0.75, -0.75, 0]} polyhedron={polyhedron} />
              <Polyhedron position={[0.75, -0.75, 0]} polyhedron={polyhedron} />
              <Polyhedron position={[-0.75, 0.75, 0]} polyhedron={polyhedron} />
              <Polyhedron position={[0.75, 0.75, 0]} polyhedron={polyhedron} />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
              />
            </Canvas>
          </div>

          {/* Informations sur les contrôles */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Contrôles :
            </h3>
            <div className="text-xs sm:text-sm text-blue-800 space-y-1">
              <p>• <strong>Rotation :</strong> Cliquer-glisser ou toucher-glisser</p>
              <p>• <strong>Zoom :</strong> Molette souris ou pincer sur mobile</p>
              <p>• <strong>Pan :</strong> Shift + cliquer-glisser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}