<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import { PredatorService } from './predator-service';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { fade } from '$lib/transitions';

	let jellyFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predatorService: PredatorService;

	const SPEED = 1;
	const DAMAGE = 3;

	$: if (jellyFish && rigidBody) {
		predatorService = new PredatorService(jellyFish, rigidBody, SPEED, DAMAGE);
	}

	useTask((delta) => {
		predatorService.updateTrajectory(delta);
	});

	function handleCollision(event: CollisionEnterEvent) {
		predatorService.handleCollision(event);
	}
</script>

<T.Group bind:ref={jellyFish}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<AutoColliders>
			<Float speed={10}>
				<T.Mesh>
					<T.SphereGeometry args={[0.5, 32, 32]} />
					<T.MeshStandardMaterial color="green" transition={fade} />
				</T.Mesh>
			</Float>
		</AutoColliders>
	</RigidBody>
</T.Group>
