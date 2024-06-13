import { increaseHealth, reduceHealth } from "$lib/stores/healthStore";
import { playerPosition } from "$lib/stores/store";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CollisionEnterEvent } from "@threlte/rapier";
import { get } from "svelte/store";
import { Group, Mesh, Vector3 } from "three";

export class Consumable {
    private direction = new Vector3();
    private hasCollided = false;

    constructor(
        private mesh: Group,
        private rigidBody: RAPIER.RigidBody,
        private onConsumed: () => void,
        private speed = 5,
        private floatSpeed = 5,
        private floatRange = 0.5,
        private healthBoost = 10
    ) {
        const initialPosition = this.generateRandomPosition();
        this.mesh.position.copy(initialPosition);
        this.rigidBody.setTranslation(initialPosition, true);
    }

    updateTrajectory(delta: number): void {
        if (!this.mesh) return;

        const currentConsumablePosition = this.mesh.position;

        if (!this.hasCollided) {
            // Move forward
            currentConsumablePosition.z -= Math.sin(delta * this.floatSpeed) * this.floatRange;
            this.rigidBody.setTranslation(currentConsumablePosition, true);
        }
    }

    handleCollision(event: CollisionEnterEvent): void {
        this.hasCollided = true;

        if (event.targetRigidBody?.handle === 0) { // consider adding playerFish name into rigid body userData
            increaseHealth(this.healthBoost);
            this.onConsumed();
        }
    }

    private generateRandomPosition(): Vector3 {
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 10 - 5;
        const z = 10;
        return new Vector3(x, y, z)
    }
}