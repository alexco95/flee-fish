import type { Vector3 } from "three";

export interface PredatorConfig {
	speed?: number;
	damage?: number;
	followPlayer?: boolean;
	movement?: (predatorPosition: Vector3, direction: Vector3, delta: number, speed: number, zigzagFrequency?: number) => void;
	attack?: () => void;
	swim?: () => void;
}