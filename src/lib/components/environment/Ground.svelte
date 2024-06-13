<script lang="ts">
	import { T, useFrame, useTask } from '@threlte/core';
	import { Vector2 } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils.js';

	const uniforms = {
		uTime: { value: 0 },
		uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) }
	};

	const vertexShader = `
		uniform float uTime;
		varying vec2 vUv;

		float random(vec2 co) {
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}

		void main() {
			vUv = uv;
			vec3 displacedPosition = position;
			float height = random(uv + uTime) * 0.2;
			displacedPosition.z += height;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
		}
	`;

	const fragmentShader = `
		varying vec2 vUv;

		void main() {
			gl_FragColor = vec4(0.94, 0.87, 0.54, 1.0); // Sand color
		}
	`;

	useTask((delta) => {
		uniforms.uTime.value = delta;
	});
</script>

<T.Group position={[0, -5.3, 0]}>
	<T.Mesh receiveShadow rotation.x={DEG2RAD * -90}>
		<T.PlaneGeometry args={[100, 100, 256, 256]} />
		<T.ShaderMaterial {uniforms} {vertexShader} {fragmentShader} />
	</T.Mesh>
</T.Group>
