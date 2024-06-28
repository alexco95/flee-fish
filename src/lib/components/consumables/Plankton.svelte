<script lang="ts">
	import RAPIER from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import { fade } from '$lib/transitions';
	import { Consumable } from '$lib/models/Consumable';
	import { createEventDispatcher } from 'svelte';
	import { FakeGlowMaterial } from '@threlte/extras';

	let plankton: Group;
	let rigidBody: RAPIER.RigidBody;
	let consumable: Consumable;
	let consumed = false;
	const dispatch = createEventDispatcher();

	const SPEED = 1;
	const FLOAT_SPEED = 2;
	const FLOAT_RANGE = 0.5;
	const HEALTH_BOOST = 10;

	$: if (plankton && rigidBody) {
		consumable = new Consumable(
			plankton,
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

<T.Group bind:ref={plankton}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<AutoColliders>
			<T.Mesh>
				<T.MeshBasicMaterial color="green" in={fade} />
				<T.IcosahedronGeometry args={[0.2, 2]} />
			</T.Mesh>
			<T.Mesh>
				<FakeGlowMaterial glowColor="green" falloff={1} in={fade} />
				<T.IcosahedronGeometry args={[0.4, 2]} />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
