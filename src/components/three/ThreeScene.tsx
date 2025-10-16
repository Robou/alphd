"use client";

import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

import { Canvas, useLoader } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";



interface ThreeSceneProps {
  modelUrl?: string;
}

export default function ThreeScene({ modelUrl }: ThreeSceneProps) {
  return (
    <Canvas>
      <OrbitControls />
      <gridHelper />
      <axesHelper />
      <Stats />
      <ambientLight intensity={0.6} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      
      
      {/* Géométrie par défaut */}
      {!modelUrl && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh>
      )}
    </Canvas>
  );
}
