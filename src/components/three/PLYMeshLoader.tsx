"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { PLYLoader } from "three-stdlib";
import { BufferGeometry, Material, Mesh } from "three";
import * as THREE from "three";
import BoundingBoxHelper from "./BoundingBoxHelper";
import { geometryCache } from "./GeometryCache";

interface MeshLoaderProps {
  url: string;
}

export default function PLYMeshLoader({ url }: MeshLoaderProps) {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<'loading' | 'cache' | 'network'>('loading');
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setCacheStatus('loading');
      return;
    }

    const loadGeometry = async () => {
      setLoading(true);
      setError(null);

      try {
        // Vérifier d'abord le cache
        const cachedGeometry = geometryCache.get(url);

        if (cachedGeometry) {
          console.log('✅ Géométrie chargée depuis le cache:', url);
          console.log('📊 Statistiques cache:', geometryCache.getStats());
          setCacheStatus('cache');
          setGeometry(cachedGeometry);
          setLoading(false);
          return;
        }

        // Sinon, charger depuis le réseau
        console.log('🌐 Chargement depuis le réseau:', url);
        console.log('📊 Statistiques cache avant chargement:', geometryCache.getStats());
        setCacheStatus('network');

        const loader = new PLYLoader();
        loader.setCrossOrigin('anonymous');

        loader.load(
          url,
          (geometry: BufferGeometry) => {
            // Préparer la géométrie
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();

            // Stocker dans le cache pour les prochaines fois
            geometryCache.set(url, geometry);

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
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Erreur lors du chargement du modèle');
        setLoading(false);
      }
    };

    loadGeometry();
  }, [url]);

  if (loading) {
    // Couleur différente selon la source : vert pour cache, orange pour réseau
    const loadingColor = cacheStatus === 'cache' ? "#00ff00" : "#ffaa00";

    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={loadingColor} wireframe />
        </mesh>
        {/* Bounding box du cube de chargement */}
        <BoundingBoxHelper
          box={new THREE.Box3(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5))}
          color={loadingColor}
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
          color={cacheStatus === 'cache' ? "#22c55e" : "#4a90e2"} // Vert pour cache, bleu pour réseau
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Bounding box du mesh chargé */}
      {geometry.boundingBox && (
        <BoundingBoxHelper
          box={geometry.boundingBox}
          color={cacheStatus === 'cache' ? "#16a34a" : "#ffff00"} // Vert foncé pour cache, jaune pour réseau
        />
      )}

      {/* Indicateur visuel subtil pour le cache */}
      {cacheStatus === 'cache' && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      )}
    </group>
  );
}