"use client";

import * as THREE from "three"

import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { Stats, OrbitControls, Environment, Clouds, Cloud } from "@react-three/drei";
import ModelPositioner from "./ModelPositioner";
import SceneUI from "./SceneUI";
import MyLevaUI, { useSceneControls } from "./LevaUI";
// import { random } from "maath"


interface Model {
  name: string;
  url: string;
  coordinates?: { x: number; y: number };
}

interface ThreeSceneProps {
  models: Model[];
  selectedModels: string[];
}

// Composant interne qui utilise les contrôles de scène
function SceneContent({ models, selectedModels }: ThreeSceneProps) {
  const controls = useSceneControls();

  return (
    <>
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
      {/* <Environment preset="sunset" /> */}

      {/* Nuages contrôlés par Leva */}
      {controls.nuages && (
        <Clouds limit={400} material={THREE.MeshLambertMaterial}>
          <Cloud seed={10 + 1} fade={10} position={[0, 3, 0]} speed={0.1} growth={0.1} volume={1} opacity={1} bounds={[2, 0.1, 2]} />
        </Clouds>
      )}

      {/* Positionneur automatique de modèles */}
      <ModelPositioner models={models} selectedModels={selectedModels} />
    </>
  );
}

export default function ThreeScene({ models, selectedModels }: ThreeSceneProps) {
  return (
    <>
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 3, 3], fov: 75}}>
          <SceneContent models={models} selectedModels={selectedModels} />
        </Canvas>

        {/* Interface utilisateur overlay */}
        <SceneUI models={models} selectedModels={selectedModels} />
        <MyLevaUI />
      </div>
    </>
  );
}
