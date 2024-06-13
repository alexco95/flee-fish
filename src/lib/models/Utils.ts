import { Vector3 } from "three";

export class Utils {
    static generateRandomPosition(): Vector3 {
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 10 - 5;
        const z = 10;
        return new Vector3(x, y, z);
    }
}