"use client";

import * as THREE from "three";

import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import {
  Stats,
  OrbitControls,
  Environment,
  Clouds,
  Cloud,
} from "@react-three/drei";
import ModelPositioner from "./ModelPositioner";
import SceneUI from "./SceneUI";
import MyLevaUI, { useSceneControls } from "./LevaUI";
// import { random } from "maath"

interface Model {
  name: string;
  url: string;
  format?: "ply" | "drc";
  coordinates?: { x: number; y: number };
}

interface ThreeSceneProps {
  models: Model[];
  selectedModels: string[];
}

// Composant interne qui utilise les contrôles de scène
function SceneContent({ models, selectedModels }: ThreeSceneProps) {
  const controls = useSceneControls();

  // Conversion sphérique → cartésien
  const getSunPosition = (
    azimuth: number,
    elevation: number,
    distance = 10
  ) => {
    const azRad = (azimuth * Math.PI) / 180;
    const elRad = (elevation * Math.PI) / 180;

    return [
      distance * Math.cos(elRad) * Math.sin(azRad),
      distance * Math.sin(elRad),
      distance * Math.cos(elRad) * Math.cos(azRad),
    ] as [number, number, number];
  };

  const sunPosition = getSunPosition(
    controls.sunAzimuth,
    controls.sunElevation
  );

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={0}
        maxDistance={50}
        maxPolarAngle={Math.PI}
        target={[0, 0, 0]}
      />
      {controls.showGrid && <gridHelper args={[10, 10]} />}
      {controls.showAxes && <axesHelper args={[2]} />}
      {controls.showStats && <Stats />}

      {/* Éclairage adapté aux unités normales */}
      {controls.showAmbientLight && (
        <ambientLight intensity={controls.ambientIntensity} />
      )}
      {controls.showDirectionalLight && (
        <directionalLight
          // position={[5, 5, 3]}
          position={sunPosition}
          intensity={controls.directionalIntensity}
          castShadow={true}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={20}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
      )}
      <pointLight position={[-5, -5, -3]} intensity={0.5} />
      {/* <Environment preset="sunset" /> */}
      {/* Nuages contrôlés par Leva */}
      {controls.nuages && (
        <Clouds limit={400} material={THREE.MeshLambertMaterial}>
          <Cloud
            seed={10 + 1}
            fade={10}
            position={[0, 3, 0]}
            speed={0.1}
            growth={0.1}
            volume={1}
            opacity={1}
            bounds={[2, 0.1, 2]}
          />
        </Clouds>
      )}
      {/* Positionneur automatique de modèles */}
      <ModelPositioner models={models} selectedModels={selectedModels} />
    </>
  );
}

export default function ThreeScene({
  models,
  selectedModels,
}: ThreeSceneProps) {
  return (
    <MyLevaUI>
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 5, 3], fov: 75, near: 0.001 }}>
          <SceneContent models={models} selectedModels={selectedModels} />
        </Canvas>

        {/* Interface utilisateur overlay */}
        <SceneUI models={models} selectedModels={selectedModels} />
      </div>
    </MyLevaUI>
  );
}
