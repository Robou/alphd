import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';


const SlopeMaterialImpl = shaderMaterial(
  {
    snowColor: new THREE.Color('#ffffff'),
    rockColor: new THREE.Color('#404040'),
    slopeThreshold: 0.7,
    smoothness: 0.2,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    
    void main() {
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 snowColor;
    uniform vec3 rockColor;
    uniform float slopeThreshold;
    uniform float smoothness;
    
    varying vec3 vWorldNormal;
    
    void main() {
      float slope = abs(dot(vWorldNormal, vec3(0.0, 1.0, 0.0)));
      
      float mix_factor = smoothstep(
        slopeThreshold - smoothness, 
        slopeThreshold + smoothness, 
        slope
      );
      
      vec3 color = mix(rockColor, snowColor, mix_factor);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Extension pour React Three Fiber
extend({ SlopeMaterialImpl });

// // Déclaration TypeScript pour JSX
// declare module '@react-three/fiber' {
//   interface ThreeElements {
//     slopeMaterialImpl: any;
//   }
// }

export default SlopeMaterialImpl;