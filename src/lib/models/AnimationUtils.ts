import type { AnimationAction } from 'three';
import { LoopOnce, LoopRepeat } from 'three';

export function transitionTo<ActionName extends string>(
    actions: Partial<Record<ActionName, AnimationAction>>,
    currentActionKey: ActionName,
    nextActionKey: ActionName,
    duration = 0.2,
    clampWhenFinished = false
): ActionName {
    const currentAction = actions[currentActionKey];
    const nextAction = actions[nextActionKey];
    if (!nextAction || currentAction === nextAction) return currentActionKey;

    nextAction.reset();
    nextAction.setLoop(clampWhenFinished ? LoopOnce : LoopRepeat, clampWhenFinished ? 1 : Infinity);
    nextAction.clampWhenFinished = clampWhenFinished;
    nextAction.enabled = true;

    if (currentAction) {
        currentAction.crossFadeTo(nextAction, duration, true);
    } else {
        nextAction.play();
    }

    return nextActionKey;
}
