<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group, PositionalAudio as ThreePositionalAudio } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import SharkModel from '../models/SharkModel.svelte';
	import { PositionalAudio } from '@threlte/extras';

	let shark: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;
	let audio: ThreePositionalAudio;

	let swim: () => void;
	let attack: () => void;

	const SPEED = 4.5;
	const DAMAGE = 70;

	$: if (shark && rigidBody) {
		predator = new Predator(shark, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
			swim,
			attack: handleAttack
		});
	}

	useTask((delta) => {
		predator.updateTrajectory(delta);
	});

	function handleCollision(event: CollisionEnterEvent) {
		predator.handleCollision(event);
	}

	function handleAttack(): void {
		if (audio) {
			audio.play();
		}
		if (attack) {
			attack();
		}
	}
</script>

<T.Group bind:ref={shark}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'roundCuboid'} args={[0.13, 0.3, 1.2, 0.3]} />
		<SharkModel bind:swim bind:attack />
	</RigidBody>
	<PositionalAudio src={'audio/shark.mp3'} bind:ref={audio} loop />
</T.Group>
