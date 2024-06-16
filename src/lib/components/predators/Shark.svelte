<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AutoColliders, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { fade } from '$lib/transitions';
	import { Predator } from '$lib/models/Predator';
	import Shark from '../models/Shark.svelte';

	let shark: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

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
	}
</script>

<T.Group bind:ref={shark}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<AutoColliders>
			<Float speed={10}>
				<Shark />
			</Float>
		</AutoColliders>
	</RigidBody>
</T.Group>
