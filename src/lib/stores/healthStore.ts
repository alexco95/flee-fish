import { writable } from "svelte/store";

export const health = writable(100);

export function reduceHealth(amount: number) {
  health.update((value) => Math.max(value - amount, 0));
}

export function increaseHealth(amount: number) {
  health.update((value) => Math.min(value + amount, 100));
}