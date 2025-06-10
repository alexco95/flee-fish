<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Collider, RigidBody, type CollisionEnterEvent } from '@threlte/rapier';
	import { Group, PositionalAudio as ThreePositionalAudio, Vector3 } from 'three';
	import RAPIER from '@dimforge/rapier3d-compat';
	import { Predator } from '$lib/models/Predator';
	import SharkModel from '../models/SharkModel.svelte';
	import { PositionalAudio } from '@threlte/extras';
	import Missile from '../projectiles/Missile.svelte';
	import { playerPosition } from '$lib/stores/store';
	import { get } from 'svelte/store';

	interface MissileData {
		id: number;
		position: Vector3;
		direction: Vector3;
	}

	let missiles: MissileData[] = [];
	let missileId = 0;

	function spawnMissile(): void {
		const position = shark ? shark.position.clone() : new Vector3();
		const target = get(playerPosition);
		const direction = target.clone().sub(position).normalize();
		missiles = [...missiles, { id: missileId++, position, direction }];
	}

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
		spawnMissile();
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

<T.Group bind:ref={shark}>
	<RigidBody bind:rigidBody gravityScale={0} on:collisionenter={handleCollision}>
		<Collider shape={'roundCuboid'} args={[0.13, 0.3, 1.2, 0.3]} />
		<SharkModel bind:swim bind:attack on:attackAnimationLoop={handleAttackLoop} />
	</RigidBody>
	<PositionalAudio src={'audio/shark.mp3'} bind:ref={audio} volume={2} />
	{#each missiles as m (m.id)}
		<Missile
			position={m.position}
			direction={m.direction}
			on:destroy={() => (missiles = missiles.filter((ms) => ms.id !== m.id))}
		/>
	{/each}
</T.Group>
