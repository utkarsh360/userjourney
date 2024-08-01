import {v4 as uuidv4} from "uuid";

export type JourneyId = string

export type Action = string;
export type Stage = string;

const sentinelStage: Stage = "sentinelStage";

export interface Transition {
    fromStage?: Stage;
    toStage: Stage;
    action: Action
}

export enum JourneyState {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export interface IJourney {
    id: JourneyId;
    state: JourneyState;
    createdAt: number;
    startedAt?: number;
    expiredAt?: number;
    next(action: Action, fromStage?: Stage, ): Stage | undefined;
    updateState(active: boolean): void;
    getState(): JourneyState;
}

export class Journey implements IJourney {
    id: JourneyId;
    state: JourneyState;
    createdAt: number;
    startedAt?: number;
    expiredAt?: number;

    private _stateMachine: Map<Stage,Map<Action,Stage>>

    // constructor(transitions: Transition[]);
    // constructor(transitions: Transition[], startAt: number, endAt: number);
    constructor(transitions: Transition[], startAt?: number, endAt?: number) {
        this.id = uuidv4();
        this._stateMachine = new Map();
        this.createdAt = Date.now();
        this.state = JourneyState.INACTIVE;
        // todo: implement timed journeys later

        transitions.forEach(transition => {
            let fromStage = transition.fromStage ?? sentinelStage;
            let toStage = transition.toStage;
            let action = transition.action;
            let transitionMap = this._stateMachine.get(fromStage);
            if(transitionMap === undefined) {
                transitionMap = new Map();
                this._stateMachine.set(fromStage, transitionMap);
            }
            transitionMap.set(action, toStage);
        })
    }

    updateState(active: boolean) {
        if(active) {
            this.state = JourneyState.ACTIVE;
        }
        else {
            this.state = JourneyState.INACTIVE;
        }
    }

    getState(): JourneyState {
        return this.state;
    }

    next(action: Action, fromStage?: Stage): Stage | undefined {
        fromStage = fromStage ?? sentinelStage;
        return this._stateMachine.get(fromStage)?.get(action);
    }

}