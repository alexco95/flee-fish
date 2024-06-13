import { createTransition } from "@threlte/extras";
import { cubicIn } from "svelte/easing";
import type { Material } from "three";

export const fade = createTransition<Material>((ref) => {
    ref.transparent = true;
    return {
        tick(t) {
            ref.opacity = t;
        },
        easing: cubicIn,
        duration: 400
    };
});