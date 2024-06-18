<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import SharkModel from '../models/SharkModel.svelte';

	let shark: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;
	let attack: () => void;

	const SPEED = 4.5;
	const DAMAGE = 70;

	$: if (shark && rigidBody) {
		predator = new Predator(shark, rigidBody, SPEED, DAMAGE);
	}

	useTask((delta) => {
		predator.updateTrajectory(delta);
	});

	function handleCollision(event: CollisionEnterEvent) {
		predator.handleCollision(event);
		attack();
	}
</script>

<T.Group bind:ref={shark}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<!-- <AutoColliders>
			<Float speed={10}>
				<T.Mesh>
					<T.BoxGeometry args={[1.2, 1.5, 4.5]} />
					<T.MeshStandardMaterial color="blue" transition={fade} />
				</T.Mesh>
			</Float>
		</AutoColliders> -->
		<Collider shape={'cuboid'} args={[0.6, 0.75, 2.25]} />
		<SharkModel bind:attack />
	</RigidBody>
</T.Group>
