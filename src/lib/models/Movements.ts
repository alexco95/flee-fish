import { Vector3 } from "three";

export type MovementFunction = (
    predatorPosition: Vector3,
    direction: Vector3,
    delta: number,
    speed: number,
    zigzagFrequency?: number
) => void;

const DEFAULT_ZIGZAG_FREQUENCY = 5;
const DEFAULT_OSCILLATION_AMPLITUDE = 0.05;
const DEFAULT_OSCILLATION_FREQUENCY = 2;

function applyMovement(
    predatorPosition: Vector3,
    modifiedDirection: Vector3,
    delta: number,
    speed: number
) {
    modifiedDirection.normalize();
    predatorPosition.addScaledVector(modifiedDirection, delta * speed);
}

export const moveStraight: MovementFunction = (predatorPosition, direction, delta, speed) => {
    applyMovement(predatorPosition, direction.clone(), delta, speed);
};

export const moveZigzag: MovementFunction = (predatorPosition, direction, delta, speed, zigzagFrequency = DEFAULT_ZIGZAG_FREQUENCY) => {
    const zigzagAmplitude = 0.5 * Math.cos(Date.now() * 0.001 * zigzagFrequency);
    const zigzagDirection = direction.clone().add(new Vector3(zigzagAmplitude, 0, 0));
    applyMovement(predatorPosition, zigzagDirection, delta, speed);
};

export const moveErratic: MovementFunction = (predatorPosition, direction, delta, speed, zigzagFrequency = 1) => {
    const erraticAmplitude = 0.5 * Math.cos(Date.now() * 0.002 * zigzagFrequency);
    const erraticDirection = direction.clone().add(new Vector3((Math.random() - 0.5) * erraticAmplitude, (Math.random() - 0.5) * erraticAmplitude, 0));
    applyMovement(predatorPosition, erraticDirection, delta, speed);
};

export const movePufferfish: MovementFunction = (predatorPosition, direction, delta, speed) => {
    const oscillation = Math.sin(Date.now() * 0.001 * DEFAULT_OSCILLATION_FREQUENCY) * DEFAULT_OSCILLATION_AMPLITUDE;
    const pufferfishDirection = direction.clone().add(new Vector3(oscillation, oscillation, 0));
    applyMovement(predatorPosition, pufferfishDirection, delta, speed);
};

export const moveSwordfish: MovementFunction = (predatorPosition, direction, delta, speed, zigzagFrequency = 10) => {
    const zigzagAmplitude = 0.05 * Math.sin(Date.now() * 0.001 * zigzagFrequency);
    const zigzagDirection = direction.clone().add(new Vector3(zigzagAmplitude, 0, zigzagAmplitude));
    applyMovement(predatorPosition, zigzagDirection, delta, speed);
};

export const moveJellyfish: MovementFunction = (predatorPosition, direction, delta, speed) => {
    const verticalOscillation = 0.1 * Math.sin(Date.now() * 0.002);
    const horizontalOscillation = 0.1 * Math.sin(Date.now() * 0.002);
    const jellyfishDirection = direction.clone().add(new Vector3(horizontalOscillation, verticalOscillation, 0));
    applyMovement(predatorPosition, jellyfishDirection, delta, speed);
};
