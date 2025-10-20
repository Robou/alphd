"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { PLYLoader } from "three-stdlib";
import { BufferGeometry, Material, Mesh } from "three";
import * as THREE from "three";
import BoundingBoxHelper from "./BoundingBoxHelper";

interface MeshLoaderProps {
  url: string;
}

export default function PLYMeshLoader({ url }: MeshLoaderProps) {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const loader = new PLYLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      url,
      (geometry: BufferGeometry) => {
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();
        setGeometry(geometry);
        setLoading(false);
      },
      (progress) => {
        console.log('Chargement:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Erreur lors du chargement du PLY:', error);
        setError('Erreur lors du chargement du modèle');
        setLoading(false);
      }
    );
  }, [url]);

  if (loading) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" wireframe />
        </mesh>
        {/* Bounding box du cube de chargement */}
        <BoundingBoxHelper
          box={new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5))}
          color="#ffaa00"
        />
      </group>
    );
  }

  if (error || !geometry) {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Bounding box de la sphère d'erreur */}
        <BoundingBoxHelper
          box={new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5))}
          color="#ff0000"
        />
      </group>
    );
  }

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#4a90e2"
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Bounding box du mesh chargé */}
      {geometry.boundingBox && (
        <BoundingBoxHelper
          box={geometry.boundingBox}
          color="#ffff00"
        />
      )}
    </group>
  );
}