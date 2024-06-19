<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import LionfishModel from '../models/LionfishModel.svelte';

	let lionFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	let swim: () => void;
	let attack: () => void;

	const SPEED = 2;
	const DAMAGE = 20;

	$: if (lionFish && rigidBody) {
		predator = new Predator(lionFish, rigidBody, SPEED, DAMAGE, attack, swim);
	}

	useTask((delta) => {
		predator.updateTrajectory(delta);
	});

	function handleCollision(event: CollisionEnterEvent) {
		predator.handleCollision(event);
	}
</script>

<T.Group bind:ref={lionFish}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<!-- TODO: update args accordingly -->
		<Collider shape={'cuboid'} args={[0.5, 0.5, 0.5]} />
		<LionfishModel bind:swim bind:attack />
	</RigidBody>
</T.Group>
