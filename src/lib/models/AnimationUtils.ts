import type { AnimationAction } from 'three';

export function transitionTo<ActionName extends string>(
    actions: Partial<Record<ActionName, AnimationAction>>,
    currentActionKey: ActionName,
    nextActionKey: ActionName,
    duration = 0.2
): ActionName {
    const currentAction = actions[currentActionKey];
    const nextAction = actions[nextActionKey];
    if (!nextAction || currentAction === nextAction) return currentActionKey;
    nextAction.enabled = true;
    if (currentAction) {
        currentAction.crossFadeTo(nextAction, duration, true);
    }
    nextAction.play();
    return nextActionKey;
}
