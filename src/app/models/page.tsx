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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Image d'arrière-plan avec fondu vers le haut
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat bg-gradient-to-l from-transparent to-gray-50"
        style={{
          backgroundImage: `linear-gradient(to top, rgb(249 250 251), transparent 60%), url('https://raw.githubusercontent.com/Robou/LidarHD/main/images/FontSancte/332_3.jpg')`
        }}
      /> */}

      {/* Image en bandeau vertical à droite avec fondu vers la transparence */}
      <div className="absolute bottom-0 center w-full w-96 z-0">
        <div className="relative  w-full">
          <img
            src="https://raw.githubusercontent.com/Robou/LidarHD/main/images/FontSancte/332_3.jpg"
            alt="Montagne 3D reconstruite en haute définition"
            className="h-full w-full object-cover"
          />
          {/* Fondu vers la transparence de droite à gauche */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-50"></div>
        </div>
      </div>

      {/* Canvas Three.js par-dessus l'image */}
      <Canvas camera={{ position: [0, 0, 3] }} className="relative z-10">
        <Polyhedron position={[-0.75, -0.75, 0]} polyhedron={polyhedron} />
        <Polyhedron position={[0.75, -0.75, 0]} polyhedron={polyhedron} />
        <Polyhedron position={[-0.75, 0.75, 0]} polyhedron={polyhedron} />
        <Polyhedron position={[0.75, 0.75, 0]} polyhedron={polyhedron} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}