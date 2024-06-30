<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import { moveJellyfish } from '$lib/models/Movements';
	import JellyfishModel from '../models/JellyfishModel.svelte';

	let jellyFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	const SPEED = 1;
	const DAMAGE = 20;

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
		<Collider shape={'capsule'} args={[0.4, 0.4]} />
		<JellyfishModel />
	</RigidBody>
</T.Group>
