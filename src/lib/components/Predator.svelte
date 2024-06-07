<script lang="ts">
	import { playerPosition } from '$lib/stores/store';
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { Mesh } from 'three';

	let position = [0, 0, 0];
	let mesh: Mesh;

	onMount(() => {
		generateRandomPosition();
	});

	useTask((delta) => {
		if (!mesh) return;
		const targetPosition = get(playerPosition);
		const currentPosition = mesh.position;
		currentPosition.lerp(targetPosition, delta * 0.1);
		mesh.position.copy(currentPosition);
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
