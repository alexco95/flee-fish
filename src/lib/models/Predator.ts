import { reduceHealth } from "$lib/stores/healthStore";
import { playerPosition } from "$lib/stores/store";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CollisionEnterEvent } from "@threlte/rapier";
import { get } from "svelte/store";
import { Group, Matrix4, Quaternion, Vector3 } from "three";
import { Utils } from "./Utils";
import { damageFactor, speedFactor } from "$lib/stores/gameSettingsStore";
import { moveStraight } from "./Movements";
import type { PredatorConfig } from "./PredatorConfig";

export class Predator {
	private direction = new Vector3();
	private rotationMatrix = new Matrix4();
	private targetQuaternion = new Quaternion();
	private hasCollided = false;
	private proximityThreshold = 4;
	private disengageThreshold = 2;
	private isAttacking = false;

	private speed: number;
    private damage: number;
    private followPlayer: boolean;
    private attack?: () => void;
    private swim?: () => void;
	private movement: (predatorPosition: Vector3, direction: Vector3, delta: number, speed: number, zigzagFrequency?: number) => void;

	constructor(
		private mesh: Group,
		private rigidBody: RAPIER.RigidBody,
		config: PredatorConfig = {}
	) {
		this.speed = config.speed ?? 5;
        this.damage = config.damage ?? 5;
        this.followPlayer = config.followPlayer ?? true;
        this.attack = config.attack;
        this.swim = config.swim;
        this.movement = config.movement ?? moveStraight
		this.initializePosition();
		this.setInitialOrientation();

		if (!this.followPlayer) {
			this.direction.set(0, 0, -1).normalize();
			this.setForwardOrientation();
		}
	}

	updateTrajectory(delta: number): void {
		if (!this.mesh) return;

		const currentSpeed = this.speed * get(speedFactor);
		const predatorPosition = this.mesh.position;

		if (!this.hasCollided && this.followPlayer) {
			this.updateDirectionAndRotationTowardsPlayer(predatorPosition);
		}

		this.mesh.quaternion.rotateTowards(this.targetQuaternion, currentSpeed * delta);
        this.movement(predatorPosition, this.direction, delta, currentSpeed); // Usar la estrategia de movimiento
		this.updateRigidBody(predatorPosition);

		this.handleAttack(predatorPosition);
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
			reduceHealth(this.damage * get(damageFactor));
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

	private setForwardOrientation(): void {
		const currentPos = this.mesh.position;
		const forwardPos = currentPos.clone().add(this.direction);

		this.rotationMatrix.lookAt(forwardPos, currentPos, this.mesh.up);
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

	private handleAttack(predatorPosition: Vector3) {
		const currentPlayerPosition = get(playerPosition);
		const distanceToPlayer = predatorPosition.distanceTo(currentPlayerPosition);

		if (distanceToPlayer < this.proximityThreshold && !this.isAttacking && this.attack) {
			this.attack();
			this.isAttacking = true;
		} else if (distanceToPlayer > this.disengageThreshold && this.isAttacking && this.swim) {
			// TODO check if the predator is still in the attack animation
			this.swim();
			this.isAttacking = false;
		}
	}

}
