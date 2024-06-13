import { increaseHealth } from "$lib/stores/healthStore";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CollisionEnterEvent } from "@threlte/rapier";
import { Group } from "three";
import { Utils } from "./Utils";

export class Consumable {
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
        const initialPosition = Utils.generateRandomPosition();
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
}