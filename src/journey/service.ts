import { journeys } from "./datastore";
import { IJourney, Journey, JourneyId, Transition } from "./model";
import * as datastore from "./datastore"

export function createNewJourney(tranitions: Transition[], startAt?: number, endAt?: number): JourneyId {
    const journey: IJourney = new Journey(tranitions, startAt, endAt);
    datastore.addJourney(journey);
    return journey.id;
}

export function getJourneyById(journeyId: JourneyId): IJourney | undefined {
    return datastore.getJourneyById(journeyId);
}

export function getAllActiveJourneys(): IJourney[] {
    return datastore.getAllActiveJourneys();
}