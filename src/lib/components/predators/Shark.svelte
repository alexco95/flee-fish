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

	let swim: () => void;
	let attack: () => void;

	const SPEED = 4.5;
	const DAMAGE = 70;

	$: if (shark && rigidBody) {
		predator = new Predator(shark, rigidBody, SPEED, DAMAGE, attack, swim);
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
		<!-- TODO: update args accordingly -->
		<Collider shape={'cuboid'} args={[0.6, 0.75, 2.25]} />
		<SharkModel bind:swim bind:attack />
	</RigidBody>
</T.Group>
