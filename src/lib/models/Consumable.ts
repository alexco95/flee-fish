import { increaseHealth } from "$lib/stores/healthStore";
import type RAPIER from "@dimforge/rapier3d-compat";
import type { CollisionEnterEvent } from "@threlte/rapier";
import { Group, Vector3 } from "three";
import { Utils } from "./Utils";

export class Consumable {
    private direction = new Vector3(0, 0, -1);

    constructor(
        private mesh: Group,
        private rigidBody: RAPIER.RigidBody,
        private onConsumed: () => void,
        private speed = 5,
        private healthBoost = 10
    ) {
        const initialPosition = Utils.generateRandomPosition();
        this.mesh.position.copy(initialPosition);
        this.rigidBody.setTranslation(initialPosition, true);
    }

    updateTrajectory(delta: number): void {
        if (!this.mesh) return;

        const movement = this.direction.clone().multiplyScalar(this.speed * delta);
        this.mesh.position.add(movement);

        this.rigidBody.setTranslation(this.mesh.position, true);
    }

    handleCollision(event: CollisionEnterEvent): void {
        if (event.targetRigidBody?.handle === 0) { // Player collision
            increaseHealth(this.healthBoost);
            this.onConsumed();
        } else {
            const normal = new Vector3(
                event.manifold.localNormal1().x,
                event.manifold.localNormal1().y,
                event.manifold.localNormal1().z
            ).normalize();
            this.direction.reflect(normal);
        }
    }
}
