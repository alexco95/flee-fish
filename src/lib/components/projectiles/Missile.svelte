<script lang="ts">
	import RAPIER from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { RigidBody, Collider, type CollisionEnterEvent } from '@threlte/rapier';
	import type { Group, Vector3 } from 'three';
	import { reduceHealth } from '$lib/stores/healthStore';
	import { createEventDispatcher } from 'svelte';

	export let position: Vector3;
	export let direction: Vector3;
	export let speed = 12;
	export let damage = 20;

	let missile: Group;
	let rigidBody: RAPIER.RigidBody;
	const dispatch = createEventDispatcher();

	useTask((delta) => {
		if (!missile) return;
		const movement = direction.clone().multiplyScalar(speed * delta);
		missile.position.add(movement);
		rigidBody.setTranslation(missile.position, true);
	});

	function handleCollision(event: CollisionEnterEvent): void {
		dispatch('destroy');
		if (event.targetRigidBody?.handle === 0) {
			reduceHealth(damage);
		}
	}
</script>

<T.Group bind:ref={missile} position={position.clone()}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'ball'} args={[0.1]} />
		<T.Mesh>
			<T.SphereGeometry args={[0.1]} />
			<T.MeshStandardMaterial color="red" />
		</T.Mesh>
	</RigidBody>
</T.Group>
