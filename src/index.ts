import { IJourneyManager, UserJourney } from "./journey/controller";
import { Journey, JourneyState, Transition } from "./journey/model";

function main() {
    const userJourneyManager: IJourneyManager = new UserJourney();
    
    // journey1
    const journey1Tranitions: Transition[] = [
        {
            action: "Login",
            toStage: "Stage1"
        },
        {
            fromStage: "Stage1",
            action: "Open Recharge Page",
            toStage: "Stage2"
        },
        {
            fromStage: "Stage2",
            action: "Recharge",
            toStage: "Stage3"
        }
    ];
    const journey1Id = userJourneyManager.createJourney(journey1Tranitions);

    // journey 2
    const journey2Tranitions: Transition[] = [
        {
            action: "Open UPI Lite account",
            toStage: "Stage1"
        },
        {
            fromStage: "Stage1",
            action: "Topup Upi Lite account",
            toStage: "Stage2"
        }
    ];
    const journey2Id = userJourneyManager.createJourney(journey2Tranitions);

    userJourneyManager.getJourney(journey1Id)?.updateState(true);
    userJourneyManager.getJourney(journey2Id)?.updateState(true);

    // user1 login
    userJourneyManager.evaluate("1", "Login");
    console.log("User 1");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("1", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("1", journey2Id));


    userJourneyManager.evaluate("1", "Open Recharge Page");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("1", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("1", journey2Id));

    console.log("User 2");
    userJourneyManager.evaluate("2", "Login");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("2", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("2", journey2Id));

    userJourneyManager.evaluate("2", "Open Recharge Page");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("2", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("2", journey2Id));
    
    userJourneyManager.evaluate("2", "Recharge");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("2", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("2", journey2Id));

    console.log("User 3");
    userJourneyManager.evaluate("3", "Login");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("3", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("3", journey2Id));
    
    userJourneyManager.evaluate("3", "Open UPI Lite account");
    console.log("Journey1 currentStage : " + userJourneyManager.getCurrentStage("3", journey1Id));
    console.log("Journey2 currentStage : " + userJourneyManager.getCurrentStage("3", journey2Id));

}

main();