<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import MantaRayModel from '../models/MantaRayModel.svelte';

	let stingray: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	const SPEED = 2;
	const DAMAGE = 30;

	$: if (stingray && rigidBody) {
		predator = new Predator(stingray, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
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

<T.Group bind:ref={stingray}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'cuboid'} args={[1.5, 0.1, 2]} />
		<MantaRayModel />
	</RigidBody>
</T.Group>
