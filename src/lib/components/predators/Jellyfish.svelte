<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { fade } from '$lib/transitions';
	import { Predator } from '$lib/models/Predator';
	import { moveJellyfish } from '$lib/models/Movements';

	let jellyFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	const SPEED = 1;
	const DAMAGE = 20;
	const jellyfishDiameter = 0.3;
	const jellyfishHeight = 0.4;

	$: if (jellyFish && rigidBody) {
		predator = new Predator(jellyFish, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
			movement: moveJellyfish,
			followPlayer: false
		});
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
			<!-- <Float speed={10}> -->
			<T.Mesh>
				<T.CylinderGeometry
					args={[jellyfishDiameter * 0.5, jellyfishDiameter * 0.5, jellyfishHeight, 32]}
				/>
				<T.MeshStandardMaterial color="pink" transparent={true} opacity={0.6} transition={fade} />
			</T.Mesh>
			<!-- </Float> -->
		</AutoColliders>
	</RigidBody>
</T.Group>
