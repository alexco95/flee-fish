import { reduceHealth } from "$lib/stores/healthStore";
import { playerPosition } from "$lib/stores/store";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CollisionEnterEvent } from "@threlte/rapier";
import { get } from "svelte/store";
import { Group, Mesh, Vector3 } from "three";

export class PredatorService {
	private direction = new Vector3();
	private hasCollided = false;

	constructor(private mesh: Group, private rigidBody: RAPIER.RigidBody) {
		const initialPosition = this.generateRandomPosition();
		this.mesh.position.copy(initialPosition);
		this.rigidBody.setTranslation(initialPosition, true);
	}

	updateTrajectory(delta: number): void {
		if (!this.mesh) return;

		const targetPosition = get(playerPosition);
		const currentPosition = this.mesh.position;

		// Update direction towards player
		if (!this.hasCollided) {
			this.direction.subVectors(targetPosition, currentPosition).normalize();
		}

		// Move predator
		currentPosition.addScaledVector(this.direction, delta * 5);
		this.rigidBody.setTranslation(currentPosition, true);
	}

	handleCollision(event: CollisionEnterEvent): void {
		this.hasCollided = true;

		// Cambiar dirección aleatoriamente después de la colisión
		this.direction.set(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();

		if (event.targetRigidBody?.handle === 0) { // consider adding playerFish name into rigid body userData
			reduceHealth(5);
		}
	}

	private generateRandomPosition(): Vector3 {
		const x = Math.random() * 10 - 5;
		const y = Math.random() * 10 - 5;
		const z = 10;
		return new Vector3(x, y, z)
	}
}