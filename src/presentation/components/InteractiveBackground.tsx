import React, { useRef } from 'react';
import { Canvas, extend, useFrame, ReactThreeFiber, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            gradientMaterial: ReactThreeFiber.Object3DNode<GradientMaterialType, typeof GradientMaterial>;
        }
    }
}

interface GradientMaterialType extends THREE.ShaderMaterial {
    uniforms: {
        u_time: { value: number };
        u_colorA: { value: THREE.Color };
        u_colorB: { value: THREE.Color };
    };
}

const GradientMaterial = shaderMaterial(
    {
        u_time: 0,
        u_colorA: new THREE.Color('#03010f'),
        u_colorB: new THREE.Color('#ff00ff'),
    },
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    `
    uniform float u_time;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      float mixValue = 0.5 + 0.5 * sin(uv.y * 5.0 + u_time * 2.0);
      gl_FragColor = vec4(mix(u_colorA, u_colorB, mixValue), 1.0);
    }
  `
);

extend({ GradientMaterial });

interface BackgroundShaderProps {
    palette: {
        DarkVibrant?: string;
        Vibrant?: string;
    }
}

function BackgroundShader({ palette }: BackgroundShaderProps) {
    const materialRef = useRef<GradientMaterialType>(null!);
    const { viewport } = useThree();

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value += delta;
        }
    });

    const colorA = new THREE.Color(palette?.DarkVibrant || '#03010f');
    const colorB = new THREE.Color(palette?.Vibrant || '#f0f');

    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <gradientMaterial ref={materialRef} u_colorA={colorA} u_colorB={colorB} />
        </mesh>
    );
}

export function InteractiveBackground({ palette }: BackgroundShaderProps) {
    return (
        // Verifique se a prop 'style' está exatamente assim:
        <Canvas
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1
            }}
        >
            <BackgroundShader palette={palette} />
        </Canvas>
    );
}