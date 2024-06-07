<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { Mesh } from 'three';

	let position = [0, 0, 0];
	let mesh: Mesh;

	onMount(() => {
		generateRandomPosition();
	});

	useTask((delta) => {
		if (!mesh) return;
		mesh.rotation.x += delta * 0.01;
	});

	function generateRandomPosition(): void {
		const x = Math.random() * 10 - 5;
		const y = Math.random() * 10 - 5;
		const z = 10;
		position = [x, y, z];
	}
</script>

<Float speed={10}>
	<T.Mesh {position} bind:ref={mesh}>
		<T.SphereGeometry args={[0.5, 32, 32]} />
		<T.MeshStandardMaterial color="red" />
	</T.Mesh>
</Float>
