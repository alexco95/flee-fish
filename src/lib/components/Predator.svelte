<script lang="ts">
	import { reduceHealth } from '$lib/stores/healthStore';
	import { playerPosition } from '$lib/stores/store';
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { createEventDispatcher, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Mesh, Vector3 } from 'three';

	const dispatcher = createEventDispatcher();

	let mesh: Mesh;
	let rigidBody: RigidBody;

	let position = [0, 0, 0];
	let distanceThreshold = 20;
	let direction = new Vector3();
	let initialDirectionSet = false;
	let hasPassedPlayerFish = false;
	let hasCollided = false;

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

		rigidBody.setTranslation(currentPosition, true);

		// Verificar si el depredador está fuera del campo de visión
		if (currentPosition.distanceTo(targetPosition) > distanceThreshold) {
			dispatcher('remove');
		}

		if (distance < 1 && !hasCollided) {
			hasCollided = true;
			reduceHealth(5); // Reducir la salud en 10 (o el valor que desees)
			dispatcher('remove'); // Remover el depredador después de la colisión
		}
	});

	function generateRandomPosition(): void {
		const x = Math.random() * 10 - 5;
		const y = Math.random() * 10 - 5;
		const z = 10;
		position = [x, y, z];
	}
</script>

<T.Group bind:ref={mesh} {position}>
	<RigidBody bind:rigidBody>
		<AutoColliders>
			<Float speed={10}>
				<T.Mesh>
					<T.SphereGeometry args={[0.5, 32, 32]} />
					<T.MeshStandardMaterial color="red" />
				</T.Mesh>
			</Float>
		</AutoColliders>
	</RigidBody>
</T.Group>
