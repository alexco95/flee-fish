<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group, PositionalAudio as ThreePositionalAudio } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import LionfishModel from '../models/LionfishModel.svelte';
	import { moveErratic } from '$lib/models/Movements';
	import { PositionalAudio } from '@threlte/extras';

	let lionFish: Group;
	let rigidBody: RAPIER.RigidBody;
	let predator: Predator;
	let audio: ThreePositionalAudio;

	let swim: () => void;
	let attack: () => void;

	const SPEED = 2;
	const DAMAGE = 20;

	$: if (lionFish && rigidBody) {
		predator = new Predator(lionFish, rigidBody, {
			speed: SPEED,
			damage: DAMAGE,
			movement: moveErratic,
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

	function handleAttackLoop(): void {
		if (audio) {
			audio.play();
		}
	}
</script>

<T.Group bind:ref={lionFish}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'ball'} args={[0.45]} />
		<LionfishModel bind:swim bind:attack on:attackAnimationLoop={handleAttackLoop} />
	</RigidBody>
	<PositionalAudio src={'audio/lionfish.mp3'} bind:ref={audio} />
</T.Group>
