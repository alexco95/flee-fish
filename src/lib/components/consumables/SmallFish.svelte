<script lang="ts">
	import RAPIER from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import type { Group } from 'three';
	import { fade } from '$lib/transitions';
	import { Consumable } from '$lib/models/Consumable';
	import { createEventDispatcher } from 'svelte';

	let smallFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let consumable: Consumable;
	let consumed = false;
	const dispatch = createEventDispatcher();

	const SPEED = 1;
	const FLOAT_SPEED = 2;
	const FLOAT_RANGE = 0.5;
	const HEALTH_BOOST = 10;

	$: if (smallFish && rigidBody) {
		consumable = new Consumable(
			smallFish,
			rigidBody,
			handleConsumed,
			SPEED,
			FLOAT_SPEED,
			FLOAT_RANGE,
			HEALTH_BOOST
		);
	}

	useTask((delta) => {
		if (!consumed) {
			consumable.updateTrajectory(delta);
		}
	});

	function handleCollision(event: CollisionEnterEvent): void {
		consumable.handleCollision(event);
	}

	function handleConsumed(): void {
		dispatch('consumed');
	}
</script>

<T.Group bind:ref={smallFish}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<AutoColliders>
			<T.Mesh>
				<T.BoxGeometry args={[0.02, 0.08, 0.15]} />
				<T.MeshStandardMaterial color="orange" in={fade} />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
