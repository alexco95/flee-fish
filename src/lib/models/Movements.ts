import { Vector3 } from "three";

export function moveStraight(predatorPosition: Vector3, direction: Vector3, delta: number, speed: number) {
    predatorPosition.addScaledVector(direction, delta * speed);
}

export function moveZigzag(predatorPosition: Vector3, direction: Vector3, delta: number, speed: number, zigzagFrequency = 5) {
    const zigzagAmplitude = 0.5 * Math.cos(Date.now() * 0.001 * zigzagFrequency);
    const zigzagDirection = new Vector3(direction.x + zigzagAmplitude, direction.y, direction.z);
    zigzagDirection.normalize();
    predatorPosition.addScaledVector(zigzagDirection, delta * speed);
}

export function moveErratic(predatorPosition: Vector3, direction: Vector3, delta: number, speed: number, zigzagFrequency?: number) {
    const erraticAmplitude = 0.5 * Math.cos(Date.now() * 0.002 * (zigzagFrequency ?? 1));
    const erraticDirection = new Vector3(direction.x + (Math.random() - 0.5) * erraticAmplitude, direction.y + (Math.random() - 0.5) * erraticAmplitude, direction.z);
    erraticDirection.normalize();
    predatorPosition.addScaledVector(erraticDirection, delta * speed);
}


export function movePufferfish(predatorPosition: Vector3, direction: Vector3, delta: number, speed: number) {
    const oscillationAmplitude = 0.05;
    const oscillationFrequency = 2;
    const oscillation = Math.sin(Date.now() * 0.001 * oscillationFrequency) * oscillationAmplitude;

    const pufferfishDirection = new Vector3(direction.x + oscillation, direction.y + oscillation, direction.z);
    pufferfishDirection.normalize();
    predatorPosition.addScaledVector(pufferfishDirection, delta * speed);
}

export function moveSwordfish(predatorPosition: Vector3, direction: Vector3, delta: number, speed: number, zigzagFrequency = 10) {
    const zigzagAmplitude = 0.05 * Math.sin(Date.now() * 0.001 * zigzagFrequency); // Frecuencia y amplitud ajustadas para suavidad
    const zigzagDirection = new Vector3(direction.x + zigzagAmplitude, direction.y, direction.z + zigzagAmplitude);
    zigzagDirection.normalize();
    predatorPosition.addScaledVector(zigzagDirection, delta * speed);
}

export function moveJellyfish(predatorPosition: Vector3, direction: Vector3, delta: number, speed: number) {
    const verticalOscillation = 0.1 * Math.sin(Date.now() * 0.002); // Oscilación vertical suave
    const horizontalOscillation = 0.1 * Math.sin(Date.now() * 0.002); // Oscilación horizontal suave
    const jellyfishDirection = new Vector3(direction.x + horizontalOscillation, direction.y + verticalOscillation, direction.z);
    jellyfishDirection.normalize();
    predatorPosition.addScaledVector(jellyfishDirection, delta * speed);
}