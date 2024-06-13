<script lang="ts">
	import { playerPosition } from '$lib/stores/store';
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { Vector3, type Mesh } from 'three';
	import ThirdPersonControls from './ThirdPersonControls.svelte';
	import { onMount } from 'svelte';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { health } from '$lib/stores/healthStore';

	let player: Mesh;
	let playerRef: Mesh;
	let rigidBody: RigidBody;

	$: if ($health === 0) {
		handleDeath();
	}

	const boundaries = {
		xMin: -5,
		xMax: 5,
		yMin: -5,
		yMax: 5
	};

	const speed = 10;

	const keysPressed = {
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
		KeyW: false,
		KeyA: false,
		KeyS: false,
		KeyD: false
	};

	let isDead = false;

	$: if (player) {
		playerPosition.set(player.position);
		playerRef = player;
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

	useTask((delta) => {
		if (player && !isDead) {
			const position = player.position;

			if (keysPressed.ArrowUp || keysPressed.KeyW) {
				position.y = Math.min(position.y + delta * speed, boundaries.yMax);
			}
			if (keysPressed.ArrowDown || keysPressed.KeyS) {
				position.y = Math.max(position.y - delta * speed, boundaries.yMin);
			}
			if (keysPressed.ArrowLeft || keysPressed.KeyA) {
				position.x = Math.max(position.x + delta * speed, boundaries.xMin);
			}
			if (keysPressed.ArrowRight || keysPressed.KeyD) {
				position.x = Math.min(position.x - delta * speed, boundaries.xMax);
			}

			playerPosition.set(player.position);

			rigidBody.setTranslation(position, true);
		}

		if (isDead) {
			// Actualizar playerPosition con la posición del rigidBody en cada frame
			const currentPosition = rigidBody.translation();
			playerRef.position.copy(currentPosition);
		}
	});

	function handleKeyDown(event: KeyboardEvent): void {
		if (keysPressed.hasOwnProperty(event.code)) {
			keysPressed[event.code] = true;
		}
	}

	function handleKeyUp(event: KeyboardEvent): void {
		if (keysPressed.hasOwnProperty(event.code)) {
			keysPressed[event.code] = false;
		}
	}

	function handleDeath(): void {
		isDead = true;
		rigidBody.setGravityScale(1, true);

		// Asegurar que el pez caiga directamente hacia abajo sin otras fuerzas
		// rigidBody.setLinvel(new Vector3(0, 0, 0), true); // Reiniciar velocidad lineal
		// rigidBody.setAngvel(new Vector3(0, 0, 0), true); // Reiniciar velocidad angular
	}
</script>

<T.PerspectiveCamera makeDefault fov={75} far={50}>
	<ThirdPersonControls bind:object={playerRef} />
</T.PerspectiveCamera>

<T.Group bind:ref={player}>
	<RigidBody bind:rigidBody gravityScale={0} enabledRotations={[false, false, false]}>
		<!-- <CollisionGroups groups={[0]}> -->
		<AutoColliders>
			<Float floatIntensity={[0.5, 0.5, 0.5]} speed={5}>
				<T.Mesh>
					<T.BoxGeometry args={[0.05, 0.1, 0.2]} />
					<T.MeshStandardMaterial color="orange" />
				</T.Mesh>
			</Float>
		</AutoColliders>
		<!-- </CollisionGroups> -->
	</RigidBody>
</T.Group>
