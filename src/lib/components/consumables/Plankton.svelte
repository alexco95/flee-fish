<script lang="ts">
	import { increaseHealth } from '$lib/stores/healthStore';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import type { Group } from 'three';
	import { ConsumableService } from './consumable-service';
	import { fade } from '$lib/transitions';

	let plankton: Group;
	let rigidBody: RAPIER.RigidBody;
	let consumed = false;
	let consumableService: ConsumableService;

	const SPEED = 1;
	const FLOAT_SPEED = 2;
	const FLOAT_RANGE = 0.5;
	const HEALTH_BOOST = 10;

	$: if (plankton && rigidBody) {
		consumableService = new ConsumableService(
			plankton,
			rigidBody,
			SPEED,
			FLOAT_SPEED,
			FLOAT_RANGE,
			HEALTH_BOOST
		);
	}

	useTask((delta) => {
		if (!consumed) {
			consumableService.updateTrajectory(delta);
		}
	});

	function handleCollision(event: CollisionEnterEvent) {
		if (event.targetRigidBody?.handle === 0) {
			consumed = true;
			increaseHealth(10);
		}
	}
</script>

<T.Group bind:ref={plankton}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<AutoColliders>
			<T.Mesh>
				<T.SphereGeometry args={[0.1, 16, 16]} />
				<T.MeshStandardMaterial color="yellow" transition={fade} />
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>
