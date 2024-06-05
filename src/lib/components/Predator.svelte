<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { Mesh } from 'three';

	export let position: number[];
	let mesh: Mesh;

	useTask((delta) => {
		if (!mesh) return;
		mesh.rotation.x += delta * 0.01;
	});
</script>

<Float speed={10}>
	<T.Mesh {position} bind:ref={mesh}>
		<T.SphereGeometry args={[0.5, 32, 32]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>
</Float>
