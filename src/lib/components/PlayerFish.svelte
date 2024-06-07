<script lang="ts">
	import { playerPosition } from '$lib/stores/store';
	import { T } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import type { Mesh } from 'three';
	import ThirdPersonControls from './ThirdPersonControls.svelte';

	let player: Mesh;
	let playerRef: Mesh;

	$: if (player) {
		playerPosition.set(player.position);
		playerRef = player;
	}
</script>

<T.PerspectiveCamera makeDefault fov={90}>
	<ThirdPersonControls bind:object={playerRef} />
</T.PerspectiveCamera>

<Float floatIntensity={[0.5, 0.5, 0.5]} speed={5}>
	<T.Mesh bind:ref={player} position={[0, 0, 0]}>
		<T.BoxGeometry />
		<T.MeshStandardMaterial color="orange" />
	</T.Mesh>
</Float>
