"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils, MeshPhysicalMaterial } from "three";
import { CarHeroFallback } from "@/components/car-hero-fallback";
import { useRef } from "react";
import type { Group } from "three";

const paint = new MeshPhysicalMaterial({
  color: "#1269b0",
  metalness: 0.68,
  roughness: 0.23,
  clearcoat: 0.94,
  clearcoatRoughness: 0.2,
});
const darkPaint = new MeshPhysicalMaterial({
  color: "#092744",
  metalness: 0.48,
  roughness: 0.28,
  clearcoat: 0.78,
});
const glass = new MeshPhysicalMaterial({
  color: "#10283d",
  metalness: 0.28,
  roughness: 0.12,
  clearcoat: 1,
  transparent: true,
  opacity: 0.94,
});
const chrome = new MeshPhysicalMaterial({
  color: "#b9cbd9",
  metalness: 0.88,
  roughness: 0.2,
});
const rubber = new MeshPhysicalMaterial({ color: "#121c27", roughness: 0.78 });
const yellow = new MeshPhysicalMaterial({
  color: "#ffd34f",
  metalness: 0.45,
  roughness: 0.26,
  emissive: "#ffd34f",
  emissiveIntensity: 0.08,
});
const lamp = new MeshPhysicalMaterial({
  color: "#e5f5ff",
  emissive: "#9bd8ff",
  emissiveIntensity: 1.35,
  roughness: 0.18,
});
const tailLamp = new MeshPhysicalMaterial({
  color: "#e9433d",
  emissive: "#bf261e",
  emissiveIntensity: 0.55,
  roughness: 0.25,
});
const grille = new MeshPhysicalMaterial({ color: "#071522", metalness: 0.58, roughness: 0.34 });

function Wheel({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.48, z]} rotation={[0, 0, x < 0 ? Math.PI / 2 : -Math.PI / 2]}>
      <mesh castShadow material={rubber}>
        <cylinderGeometry args={[0.405, 0.405, 0.23, 40]} />
      </mesh>
      <mesh position={[0, 0.122, 0]} material={chrome}>
        <cylinderGeometry args={[0.245, 0.245, 0.018, 32]} />
      </mesh>
      <mesh position={[0, 0.134, 0]} material={darkPaint}>
        <cylinderGeometry args={[0.165, 0.165, 0.021, 32]} />
      </mesh>
      <mesh position={[0, 0.148, 0]} material={chrome}>
        <cylinderGeometry args={[0.065, 0.065, 0.025, 24]} />
      </mesh>
      <mesh position={[0, -0.12, 0]} material={darkPaint}>
        <cylinderGeometry args={[0.245, 0.245, 0.018, 32]} />
      </mesh>
    </group>
  );
}

function DrivingSchoolCar({ isHovered }: { isHovered: boolean }) {
  const car = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);

  useFrame(({ clock }, delta) => {
    if (!car.current) return;
    const idleTurn = Math.sin(clock.elapsedTime * 0.22) * 0.035;
    car.current.rotation.y = MathUtils.damp(
      car.current.rotation.y,
      idleTurn + pointer.x * 0.11 + (isHovered ? 0.2 : 0),
      isHovered ? 4.2 : 3.1,
      delta,
    );
    car.current.rotation.x = MathUtils.damp(car.current.rotation.x, -pointer.y * 0.025 + (isHovered ? -0.025 : 0), 3, delta);
    car.current.position.y = MathUtils.damp(
      car.current.position.y,
      0.025 + Math.sin(clock.elapsedTime * 0.7) * 0.018 + (isHovered ? 0.1 : 0),
      3.2,
      delta,
    );
    const targetScale = isHovered ? 1.035 : 1;
    const scale = MathUtils.damp(car.current.scale.x, targetScale, 3, delta);
    car.current.scale.setScalar(scale);
  });

  return (
    <group ref={car} position={[0, 0.03, 0]}>
      {/* Low chassis and sculpted body volumes form the locally modeled sedan while a licensed GLB is unavailable. */}
      <RoundedBox args={[1.92, 0.48, 4.08]} radius={0.19} smoothness={5} position={[0, 0.77, -0.02]} castShadow receiveShadow material={paint} />
      <RoundedBox args={[1.86, 0.27, 1.37]} radius={0.13} smoothness={5} position={[0, 0.99, 1.34]} castShadow material={paint} />
      <RoundedBox args={[1.83, 0.25, 0.84]} radius={0.12} smoothness={5} position={[0, 0.94, -1.54]} castShadow material={paint} />

      <RoundedBox args={[1.52, 0.66, 1.76]} radius={0.22} smoothness={7} position={[0, 1.28, -0.03]} castShadow material={darkPaint} />
      <RoundedBox args={[1.37, 0.12, 1.3]} radius={0.08} smoothness={5} position={[0, 1.64, -0.11]} castShadow material={paint} />

      {/* Dark window panels, windshield, and rear glass. */}
      <RoundedBox args={[0.025, 0.38, 1.16]} radius={0.035} smoothness={4} position={[0.762, 1.33, -0.1]} rotation={[0, -0.06, 0]} material={glass} />
      <RoundedBox args={[0.025, 0.38, 1.16]} radius={0.035} smoothness={4} position={[-0.762, 1.33, -0.1]} rotation={[0, 0.06, 0]} material={glass} />
      <RoundedBox args={[1.35, 0.025, 0.5]} radius={0.04} smoothness={4} position={[0, 1.34, 0.84]} rotation={[-0.48, 0, 0]} material={glass} />
      <RoundedBox args={[1.31, 0.025, 0.4]} radius={0.04} smoothness={4} position={[0, 1.34, -0.91]} rotation={[0.42, 0, 0]} material={glass} />

      {/* Front fascia, grille, and lamps. */}
      <RoundedBox args={[0.72, 0.2, 0.055]} radius={0.055} smoothness={4} position={[0, 0.69, 2.075]} material={grille} />
      {[0.61, 0.38, 0.15, -0.15, -0.38, -0.61].map((x) => (
        <mesh key={x} position={[x, 0.69, 2.11]} material={chrome}>
          <boxGeometry args={[0.018, 0.13, 0.012]} />
        </mesh>
      ))}
      {[-0.67, 0.67].map((x) => (
        <group key={x}>
          <RoundedBox args={[0.36, 0.13, 0.06]} radius={0.05} smoothness={4} position={[x, 0.94, 2.03]} material={lamp} />
          <RoundedBox args={[0.27, 0.055, 0.045]} radius={0.022} smoothness={4} position={[x, 0.53, 2.02]} material={darkPaint} />
        </group>
      ))}
      <RoundedBox args={[0.38, 0.09, 0.045]} radius={0.035} smoothness={4} position={[0, 0.55, 2.06]} material={yellow} />
      <RoundedBox args={[1.7, 0.12, 0.15]} radius={0.055} smoothness={4} position={[0, 0.44, 1.99]} material={darkPaint} />

      {/* Fine yellow coach line and side details. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.974, 0.78, -0.05]} material={yellow}>
            <boxGeometry args={[0.018, 0.018, 2.68]} />
          </mesh>
          <RoundedBox args={[0.07, 0.09, 0.2]} radius={0.025} smoothness={3} position={[side * 0.98, 1.04, 0.86]} material={darkPaint} />
          <RoundedBox args={[0.08, 0.1, 0.19]} radius={0.035} smoothness={3} position={[side * 0.83, 1.09, 0.91]} material={paint} />
          <RoundedBox args={[0.025, 0.035, 0.28]} radius={0.012} smoothness={3} position={[side * 0.97, 0.88, 0.34]} material={chrome} />
          <RoundedBox args={[0.08, 0.14, 0.31]} radius={0.035} smoothness={3} position={[side * 0.94, 0.88, -1.84]} material={tailLamp} />
        </group>
      ))}

      <Wheel x={-0.96} z={1.28} />
      <Wheel x={0.96} z={1.28} />
      <Wheel x={-0.96} z={-1.28} />
      <Wheel x={0.96} z={-1.28} />
    </group>
  );
}

export function CarScene({ isHovered }: { isHovered: boolean }) {
  return (
    <Canvas
      className="hero-car-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [4.9, 2.35, 6.2], fov: 33, near: 0.1, far: 80 }}
      shadows
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<CarHeroFallback />}
      aria-label="Interactive 3D blue sedan"
    >
      <ambientLight intensity={1.15} color="#dcecff" />
      <hemisphereLight args={["#e8f4ff", "#233448", 1.4]} />
      <directionalLight position={[-4, 7, 5]} intensity={3.1} color="#fff5d8" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[5, 3, -4]} intensity={2.1} color="#78b9ff" />
      <spotLight position={[1, 6, 4]} intensity={34} angle={0.56} penumbra={0.8} color="#ffffff" />
      <DrivingSchoolCar isHovered={isHovered} />
      <ContactShadows position={[0, 0.025, 0]} opacity={0.38} scale={6.5} blur={2.8} far={3.4} resolution={512} color="#10243b" />
    </Canvas>
  );
}
