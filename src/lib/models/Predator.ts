import { reduceHealth } from "$lib/stores/healthStore";
import { playerPosition } from "$lib/stores/store";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CollisionEnterEvent } from "@threlte/rapier";
import { get } from "svelte/store";
import { Group, Matrix4, Quaternion, Vector3 } from "three";
import { Utils } from "./Utils";

export class Predator {
	private direction = new Vector3();
	private rotationMatrix = new Matrix4();
	private targetQuaternion = new Quaternion();
	private hasCollided = false;

	constructor(
		private mesh: Group,
		private rigidBody: RAPIER.RigidBody,
		private speed = 5,
		private damage = 5
	) {
		this.initializePosition();
		this.setInitialOrientation();
	}

	updateTrajectory(delta: number): void {
		if (!this.mesh) return;

		const predatorPosition = this.mesh.position;

		if (!this.hasCollided) {
			this.updateDirectionAndRotationTowardsPlayer(predatorPosition);
		}

		this.mesh.quaternion.rotateTowards(this.targetQuaternion, this.speed * delta);
		predatorPosition.addScaledVector(this.direction, delta * this.speed);
		this.updateRigidBody(predatorPosition);
	}


	handleCollision(event: CollisionEnterEvent): void {
		this.hasCollided = true;
		this.direction.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

		const currentPos = this.mesh.position;
		const escapeTargetPos = currentPos.clone().add(this.direction);

		this.rotationMatrix.lookAt(escapeTargetPos, currentPos, this.mesh.up);
		this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);

		this.mesh.quaternion.slerp(this.targetQuaternion, 0.1);
		this.updateRigidBody(currentPos);

		if (event.targetRigidBody?.handle === 0) {
			reduceHealth(this.damage);
		}
	}

	private initializePosition(): void {
		const initialPosition = Utils.generateRandomPosition();
		this.mesh.position.copy(initialPosition);
		this.rigidBody.setTranslation(initialPosition, true);
	}

	private setInitialOrientation(): void {
		const targetPosition = get(playerPosition);
		const currentPos = this.mesh.position;

		this.rotationMatrix.lookAt(targetPosition, currentPos, this.mesh.up);
		this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);

		this.mesh.quaternion.copy(this.targetQuaternion);
		this.rigidBody.setRotation(this.mesh.quaternion, true);
	}

	private updateDirectionAndRotationTowardsPlayer(predatorPosition: Vector3): void {
		const targetPosition = get(playerPosition);
		this.direction.subVectors(targetPosition, predatorPosition).normalize();

		this.rotationMatrix.lookAt(targetPosition, predatorPosition, this.mesh.up);
		this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);
	}

	private updateRigidBody(position: Vector3): void {
		this.rigidBody.setTranslation(position, true);
		this.rigidBody.setRotation(this.mesh.quaternion, true);
	}

}
