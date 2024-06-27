<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import SharkModel from '../models/SharkModel.svelte';
	import PufferModel from '../models/PufferModel.svelte';
	import { movePufferfish } from '$lib/models/Movements';

	let puffer: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;

	let swim: () => void;
	let attack: () => void;

	const SPEED = 1.5;
	const DAMAGE = 20;

	$: if (puffer && rigidBody) {
		predator = new Predator(puffer, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
			movement: movePufferfish
		});
	}

	useTask((delta) => {
		predator.updateTrajectory(delta);
	});

	function handleCollision(event: CollisionEnterEvent) {
		predator.handleCollision(event);
	}
</script>

<T.Group bind:ref={puffer}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'ball'} args={[0.4]} />
		<PufferModel bind:swim bind:attack />
	</RigidBody>
</T.Group>
