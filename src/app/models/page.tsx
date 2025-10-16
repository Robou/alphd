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
    <Canvas camera={{ position: [0, 0, 3] }}>
      <Polyhedron position={[-0.75, -0.75, 0]} polyhedron={polyhedron} />
      <Polyhedron position={[0.75, -0.75, 0]} polyhedron={polyhedron} />
      <Polyhedron position={[-0.75, 0.75, 0]} polyhedron={polyhedron} />
      <Polyhedron position={[0.75, 0.75, 0]} polyhedron={polyhedron} />
      <OrbitControls />
    </Canvas>
  )
}