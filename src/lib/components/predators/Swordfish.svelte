<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group, PositionalAudio as ThreePositionalAudio } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import SwordfishModel from '../models/SwordfishModel.svelte';
	import { moveSwordfish } from '$lib/models/Movements';
	import { PositionalAudio } from '@threlte/extras';

	let swordfish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;
	let audio: ThreePositionalAudio;

	let swim: () => void;
	let attack: () => void;

	const SPEED = 5;
	const DAMAGE = 60;

	$: if (swordfish && rigidBody) {
		predator = new Predator(swordfish, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
			movement: moveSwordfish,
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

<T.Group bind:ref={swordfish}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'roundCuboid'} args={[0.14, 0.3, 2.22, 0.3]} />
		<SwordfishModel bind:swim bind:attack />
	</RigidBody>
	<PositionalAudio src={'audio/sword.mp3'} bind:ref={audio} loop volume={1} />
</T.Group>
