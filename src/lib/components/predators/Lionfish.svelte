<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { AutoColliders, Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import LionfishModel from '../models/LionfishModel.svelte';
	import { moveErratic } from '$lib/models/Movements';

	let lionFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	let swim: () => void;
	let attack: () => void;

	const SPEED = 2;
	const DAMAGE = 20;

	$: if (lionFish && rigidBody) {
		predator = new Predator(lionFish, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
			movement: moveErratic
		});
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
		<Collider shape={'ball'} args={[0.45]} />
		<LionfishModel bind:swim bind:attack />
	</RigidBody>
</T.Group>
