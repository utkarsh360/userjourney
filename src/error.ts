import { JourneyId } from "./journey/model";


export class JourneyDoesNotExistException extends Error {
    constructor(journeyId: JourneyId) {
        super(`Journey with this id does not exist : ${journeyId}`);
    }
}