import { JourneyDoesNotExistException } from "../error";
import { IJourney, JourneyId, Transition, Stage, Action, Journey } from "./model";
import * as journeyService from "./service"

export type UserId = string;

export interface IJourneyManager {
    createJourney(transitions: Transition[]): JourneyId;
    getJourney(journeyId: JourneyId): IJourney | undefined;
    updateState(journeyId: JourneyId, active: boolean): void;
    getCurrentStage(userId: UserId, journeyId: JourneyId): Stage | undefined;
    isOnboarded(userId: UserId, journeyId: JourneyId): boolean;
    evaluate(userId: UserId, eventPayload: Action): void;
}

export class UserJourney implements IJourneyManager {

    userJourneysByUser: Map<UserId, Map<JourneyId, Stage>>

    constructor() {
        this.userJourneysByUser = new Map();
    }

    createJourney(transitions: Transition[]): JourneyId { // todo: implement timed journeys later
        return journeyService.createNewJourney(transitions)
    }

    getJourney(journeyId: JourneyId): IJourney | undefined {
        return journeyService.getJourneyById(journeyId);
    }

    updateState(journeyId: string, active: boolean): void {
        const journey = journeyService.getJourneyById(journeyId);
        if(journey == undefined) {
            throw new JourneyDoesNotExistException(journeyId);
        } 
        journey.updateState(active);
    }

    evaluate(userId: UserId, eventPayload: Action) {
        let userJourneys = this.userJourneysByUser.get(userId);
        if(userJourneys === undefined) {
            userJourneys = new Map();
            this.userJourneysByUser.set(userId, userJourneys);
        }
        userJourneys.forEach((currentStage: Stage, journeyId: JourneyId) => {
            // console.log("JourneyId : ", journeyId);
            // console.log("all journeys : ", journeyService.getAllActiveJourneys());
            const journey = journeyService.getJourneyById(journeyId)!;
            // console.log("journey : ", journey);
            const nextStage = journey.next(eventPayload, currentStage);
            if(nextStage) {
                userJourneys!.set(journeyId, nextStage);
            }
        })
        const allJourneys = journeyService.getAllActiveJourneys();
        // console.log("All journeys : ", allJourneys)
        // console.log(userId);
        // console.log(eventPayload);
        allJourneys.forEach(journey => {
            const nextStage = journey.next(eventPayload);
            // console.log("Next stage : ", nextStage);
            if(nextStage) {
                userJourneys?.set(journey.id, nextStage);
            }
        });
    }

    getCurrentStage(userId: UserId, journeyId: string): Stage | undefined {
        return this.userJourneysByUser.get(userId)?.get(journeyId) ?? "Not Onboarded Yet";
    }

    isOnboarded(userId: UserId, journeyId: string): boolean {
        if(this.userJourneysByUser.get(userId)?.get(journeyId)) {
            return true;
        }
        return false;
    }
    
}