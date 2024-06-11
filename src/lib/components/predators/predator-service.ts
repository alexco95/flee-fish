import { reduceHealth } from "$lib/stores/healthStore";
import { playerPosition } from "$lib/stores/store";
import { get } from "svelte/store";
import { Mesh, Vector3 } from "three";

export class PredatorService {
    private direction = new Vector3();
    private initialDirectionSet = false;
    private hasPassedPlayerFish = false;
    private hasCollided = false;

    constructor(private mesh: Mesh, private rigidBody: any ) {
        this.mesh.position.copy(this.generateRandomPosition());
        this.rigidBody.setTranslation(this.mesh.position, true);
    }

    updateTrajectory(delta: number): void {
        if (!this.mesh) return;

		const targetPosition = get(playerPosition);
		const currentPosition = this.mesh.position;

		// Calcular la dirección inicial si no se ha calculado antes
		if (!this.initialDirectionSet) {
			this.direction = new Vector3().subVectors(targetPosition, currentPosition).normalize();
			this.initialDirectionSet = true;
		}

		// Verificar la distancia al PlayerFish
		const distance = currentPosition.distanceTo(targetPosition);

		// Si la distancia es menor a un umbral pequeño, continuar en la dirección original sin recalcular
		if (distance < 1) {
			this.hasPassedPlayerFish = true;
		}

		// Si aún no ha pasado el PlayerFish, recalcular la dirección
		if (!this.hasPassedPlayerFish) {
			this.direction = new Vector3().subVectors(targetPosition, currentPosition).normalize();
		}

		// Mover al depredador en la dirección del PlayerFish o en la misma dirección si ya lo ha pasado
		currentPosition.add(this.direction.clone().multiplyScalar(delta * 5));

		// Copiar la nueva posición al mesh
		this.mesh.position.copy(currentPosition);

		this.rigidBody.setTranslation(currentPosition, true);


		if (distance < 1 && !this.hasCollided) {
			this.hasCollided = true;
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