import Shark from '$lib/components/predators/Shark.svelte';
import Jellyfish from '$lib/components/predators/Jellyfish.svelte';
import Plankton from '$lib/components/consumables/Plankton.svelte';
import { gamePaused } from '$lib/stores/store';
import { writable } from 'svelte/store';


export class Game {
    predators = writable([]);
    consumables = writable([]);

    predatorTypes = [Shark, Jellyfish];
    consumableTypes = [Plankton];

    predatorsInterval: number | undefined = undefined;
    consumablesInterval: number | undefined = undefined;

    constructor() {
        gamePaused.subscribe((paused) => {
            if (!paused) {
                this.startIntervals();
            } else {
                this.clearIntervals();
            }
        });


    }

    startIntervals() {
        this.predatorsInterval = setInterval(() => this.addPredator(), 2000);
        this.consumablesInterval = setInterval(() => this.addConsumable(), 5000);
    }

    clearIntervals() {
        if (this.predatorsInterval !== undefined) {
            clearInterval(this.predatorsInterval);
        }
        if (this.consumablesInterval !== undefined) {
            clearInterval(this.consumablesInterval);
        }
    }

    addPredator() {
        const PredatorComponent = this.predatorTypes[Math.floor(Math.random() * this.predatorTypes.length)];
        this.predators.update((predators) => [...predators, PredatorComponent ]);
    }

    addConsumable() {
        const ConsumableComponent = this.consumableTypes[Math.floor(Math.random() * this.consumableTypes.length)];
        this.consumables.update((consumables) => [...consumables, ConsumableComponent ]);
    }


    handleVisibilityChange() {
        gamePaused.set(document.hidden);

        if (document.hidden) {
            this.clearIntervals();
        } else {
            this.startIntervals();
        }
    }
}