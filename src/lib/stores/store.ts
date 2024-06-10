import { writable } from "svelte/store";
import { Vector3 } from "three";

export const playerPosition = writable(new Vector3(0, 0, 0));