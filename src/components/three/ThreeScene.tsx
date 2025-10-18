"use client";

import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import ModelPositioner from "./ModelPositioner";
import SceneUI from "./SceneUI";

interface Model {
  name: string;
  url: string;
  coordinates?: { x: number; y: number };
}

interface ThreeSceneProps {
  models: Model[];
  selectedModels: string[];
}

export default function ThreeScene({ models, selectedModels }: ThreeSceneProps) {
  return (
    <>
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 1, 1], fov: 75 }}>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />

          <gridHelper args={[10, 10]} />
          <axesHelper args={[2]} />
          <Stats />

          {/* Éclairage adapté aux unités normales */}
          <ambientLight intensity={1.3} />
          <directionalLight
            position={[5, 5, 3]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, -5, -3]} intensity={0.5} />

          {/* Positionneur automatique de modèles */}
          <ModelPositioner models={models} selectedModels={selectedModels} />
        </Canvas>

        {/* Interface utilisateur overlay */}
        <SceneUI models={models} selectedModels={selectedModels} />
      </div>
    </>
  );
}
