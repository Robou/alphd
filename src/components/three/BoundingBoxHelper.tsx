"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Box3, Box3Helper as ThreeBox3Helper, ColorRepresentation } from "three";

interface BoundingBoxHelperProps {
  box: Box3;
  color?: ColorRepresentation;
}

export default function BoundingBoxHelper({ box, color = "#ffff00" }: BoundingBoxHelperProps) {
  const helperRef = useRef<ThreeBox3Helper>(null);

  useEffect(() => {
    if (helperRef.current) {
      helperRef.current.box = box;
    }
  }, [box]);

  return (
    <primitive
      ref={helperRef}
      object={new ThreeBox3Helper(box, color)}
    />
  );
}