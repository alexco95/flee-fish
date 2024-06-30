import Shark from '$lib/components/predators/Shark.svelte';
import Jellyfish from '$lib/components/predators/Jellyfish.svelte';
import Plankton from '$lib/components/consumables/Plankton.svelte';
import { gamePaused } from '$lib/stores/store';
import { writable, type Writable } from 'svelte/store';
import Lionfish from '$lib/components/predators/Lionfish.svelte';
import MantaRay from '$lib/components/predators/MantaRay.svelte';
import Puffer from '$lib/components/predators/Puffer.svelte';
import Swordfish from '$lib/components/predators/Swordfish.svelte';

export interface GameObject {
    component: typeof Shark | typeof Jellyfish | typeof Plankton | typeof MantaRay | typeof Lionfish | typeof Puffer | typeof Swordfish;
    id: number;
}

export class Game {
    private _predators = writable<GameObject[]>([]);
    private _consumables = writable<GameObject[]>([]);

    private predatorTypes = [
        Shark, 
        Jellyfish, 
        MantaRay, 
        Lionfish,
        Puffer,
        Swordfish
    ];
    private consumableTypes = [
        Plankton, 
        // more to come
    ];
    private predatorsInterval: number | undefined = undefined;
    private consumablesInterval: number | undefined = undefined;

    private idCounter = 0;

    constructor() {
        gamePaused.subscribe((paused) => {
            if (!paused) {
                this.startIntervals();
            } else {
                this.clearIntervals();
            }
        });
    }

    get predators(): Writable<GameObject[]> {
        return this._predators;
    }

    get consumables(): Writable<GameObject[]> {
        return this._consumables;
    }

    startIntervals(): void {
        this.predatorsInterval = setInterval(() => this.addPredator(), 2000);
        this.consumablesInterval = setInterval(() => this.addConsumable(), 5000);
    }

    clearIntervals(): void {
        if (this.predatorsInterval !== undefined) {
            clearInterval(this.predatorsInterval);
        }
        if (this.consumablesInterval !== undefined) {
            clearInterval(this.consumablesInterval);
        }
    }

    addPredator(): void {
        const PredatorComponent = this.predatorTypes[Math.floor(Math.random() * this.predatorTypes.length)];
        this._predators.update((predators) => [...predators, { component: PredatorComponent, id: this.idCounter++ }]);
    }

    addConsumable(): void {
        const ConsumableComponent = this.consumableTypes[Math.floor(Math.random() * this.consumableTypes.length)];
        this._consumables.update((consumables) => [...consumables, { component: ConsumableComponent, id: this.idCounter++ }]);
    }

    removeConsumable(id: number): void {
        this._consumables.update((consumables) => consumables.filter((consumable) => consumable.id !== id));
    }

    handleVisibilityChange(): void {
        gamePaused.update(() => document.hidden);

        if (document.hidden) {
            this.clearIntervals();
        } else {
            this.startIntervals();
        }
    }
}