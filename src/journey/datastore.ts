import { IJourney, Journey, JourneyId, JourneyState } from "./model";

export const journeys: IJourney[] = [];

export function addJourney(journey: IJourney): JourneyId {
    journeys.push(journey)
    return journey.id;
}

export function getJourneyById(journeyId: JourneyId): IJourney | undefined {
    return journeys.find(journey => journey.id === journeyId)
}

export function getAllActiveJourneys(): IJourney[] {
    return journeys.filter(journey => journey.state == JourneyState.ACTIVE);
}