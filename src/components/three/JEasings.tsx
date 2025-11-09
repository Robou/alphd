import { useFrame } from '@react-three/fiber';
import JEASINGS from 'jeasings';

export default function JEasings() {
  useFrame(() => {
    JEASINGS.update();
  });
  return null;
}