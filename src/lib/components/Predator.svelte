<script lang="ts">
	import { playerPosition } from '$lib/stores/store';
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { createEventDispatcher, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Mesh, Vector3 } from 'three';

	const dispatcher = createEventDispatcher();

	let mesh: Mesh;
	let position = [0, 0, 0];
	let distanceThreshold = 20;
	let direction = new Vector3();
	let initialDirectionSet = false;
	let hasPassedPlayerFish = false;

	onMount(() => {
		generateRandomPosition();
	});

	useTask((delta) => {
		if (!mesh) return;

		const targetPosition = get(playerPosition);
		const currentPosition = mesh.position;

		// Calcular la dirección inicial si no se ha calculado antes
		if (!initialDirectionSet) {
			direction = new Vector3().subVectors(targetPosition, currentPosition).normalize();
			initialDirectionSet = true;
		}

		// Verificar la distancia al PlayerFish
		const distance = currentPosition.distanceTo(targetPosition);

		// Si la distancia es menor a un umbral pequeño, continuar en la dirección original sin recalcular
		if (distance < 1) {
			hasPassedPlayerFish = true;
		}

		// Si aún no ha pasado el PlayerFish, recalcular la dirección
		if (!hasPassedPlayerFish) {
			direction = new Vector3().subVectors(targetPosition, currentPosition).normalize();
		}

		// Mover al depredador en la dirección del PlayerFish o en la misma dirección si ya lo ha pasado
		currentPosition.add(direction.clone().multiplyScalar(delta * 5));

		// Copiar la nueva posición al mesh
		mesh.position.copy(currentPosition);

		// Verificar si el depredador está fuera del campo de visión
		if (currentPosition.distanceTo(targetPosition) > distanceThreshold) {
			dispatcher('remove');
		}
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
