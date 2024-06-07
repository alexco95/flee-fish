<script lang="ts">
	import { playerPosition } from '$lib/stores/store';
	import { T } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import type { Mesh } from 'three';

	let mesh: Mesh;

	$: if (mesh) {
		playerPosition.set(mesh.position);
	}
</script>

<Float floatIntensity={[0.5, 0.5, 0.5]} speed={5}>
	<T.Mesh bind:ref={mesh} position={[0, 0, 0]}>
		<T.BoxGeometry />
		<T.MeshStandardMaterial color="orange" />
	</T.Mesh>
</Float>
