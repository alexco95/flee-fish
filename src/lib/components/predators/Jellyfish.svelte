<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { fade } from '$lib/transitions';
	import { Predator } from '$lib/models/Predator';

	let jellyFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	const SPEED = 1;
	const DAMAGE = 3;

	$: if (jellyFish && rigidBody) {
		predator = new Predator(jellyFish, rigidBody, SPEED, DAMAGE);
	}

	useTask((delta) => {
		predator.updateTrajectory(delta);
	});

	function handleCollision(event: CollisionEnterEvent) {
		predator.handleCollision(event);
	}
</script>

<T.Group bind:ref={jellyFish}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<AutoColliders>
			<Float speed={10}>
				<T.Mesh>
					<T.BoxGeometry />
					<T.MeshStandardMaterial color="green" transition={fade} />
				</T.Mesh>
			</Float>
		</AutoColliders>
	</RigidBody>
</T.Group>
