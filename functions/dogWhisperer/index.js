'use strict';

var FitBark = require('fitbark-node-client');
var fitBark = new FitBark(process.env.FITBARK_API_TOKEN);
var helpers = require('./helpers');

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the Alexa Dog Whisperer skill. ' +
        'Please tell me which of your dogs you would like to talk to by saying, talk to Max';
    const repromptText = 'Please tell which dog to talk to by saying, ' +
        'talk to Charlie';
    const shouldEndSession = false;

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Talk to you later!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, helpers.buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createSessionAttributes(dog) {
    return {
        dog,
    };
}

function getDogBreed(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    let breed = `a ${dog.breed1.name}`;

    if(dog.breed2.name){
        breed = `part ${dog.breed1.name} and part ${dog.breed2.name}`
    }

    speechOutput = `${dog.name} says: bark bark I am ${breed}.`;

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogMedicalConditions(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if(dog.medical_conditions.length > 0){
        speechOutput = `${dog.name} says: bark I am ${dog.medical_conditions[0].name}.`;
    }else{
        speechOutput = `${dog.name} says: nope, I do not have any medical conditions.`;
    }

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getBatteryLevel(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    let recommendation = '';
    if(dog.battery_level > 50){
        recommendation = "doesn't need charging"
    } else if (dog.battery_level > 30){
        recommendation = "should be charged soon"
    } else {
        recommendation = "needs to be charged"
    }

    speechOutput = `${dog.name} says: bow wow my battery is at ${dog.battery_level} percent. My FitBark ${recommendation}.`;

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogActivity(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        speechOutput = `${dog.name} says: bark bark ${activityDate} I slept a ton!`;
    }

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogWeight(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if(dog){
        speechOutput = `${dog.name} says: bark bark I weigh ${dog.weight} ${dog.weight_unit}!`;
    }

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getSpayedOrNeutered(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    let spayedOrNeutered = '';
    let gender = '';

    if (dog.gender == 'M') {
        gender = 'male';
        spayedOrNeutered = 'neutered';
    } else {
        gender = 'female';
        spayedOrNeutered = 'spayed';
    }

    if (!dog.neutered){
        speechOutput = `${dog.name} says: woof woof no, I am not ${spayedOrNeutered}.`;
    }else{
        speechOutput = `${dog.name} says: woof woof I am a ${gender} dog so I am ${spayedOrNeutered}.`;
    }

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogBirthday(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    const age = helpers.calculateAge(new Date(dog.birth));


    speechOutput = `${dog.name} says: bark bark my birthday is ${dog.birth}. I will be turning ${age+1}. What are you getting me?`;

    callback(sessionAttributes,
        helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the dog in the session and prepares the speech to reply to the user.
 */
function setDogInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const dogNameSlot = intent.slots.Dog;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    if (dogNameSlot) {
        const dogName = dogNameSlot.value;

        fitBark.getDog(dogName).then((dog)=>{
            if (dog) {
                sessionAttributes = createSessionAttributes(dog);
                speechOutput = `I can now talk to ${dog.name} for you. Say something like, what did you do yesterday?`;
                repromptText = `You can ask me to say anything to ${dog.name}, try something like what did you do yesterday?`;
            }else{
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
                repromptText = `You can only talk to dogs you have a relation to. Please tell me which dog to talk to by saying, talk to maxwell`; 
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = "I didn't catch which dog you wanted me to talk to. Please tell me by saying talk to charlie.";
        repromptText = "Please tell me which dog to talk to by saying talk to max."
        
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function getDogFromSession(intent, session, callback) {
    const cardTitle = intent.name;
    let speechOutput = '';
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let dog;

    if (session.attributes) {
        dog = session.attributes.dog;
    }

    if (dog) {
        return dog;
    } else {
        speechOutput = "I didn't catch which dog you wanted me to talk to. Please tell me by saying talk to charlie.";
        repromptText = "Please tell me which dog to talk to by saying talk to max."
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    if (intentName === 'SetDogName') {
        setDogInSession(intent, session, callback);
    } else if (intentName === 'GetDogMedicalConditions') {
        getDogMedicalConditions(intent, session, callback);
    } else if (intentName === 'GetDogBreed') {
        getDogBreed(intent, session, callback);
    } else if (intentName === 'GetDogActivity') {
        getDogActivity(intent, session, callback);
    } else if (intentName === 'GetBatteryLevel') {
        getBatteryLevel(intent, session, callback);
    } else if (intentName === 'GetSpayedOrNeutered') {
        getSpayedOrNeutered(intent, session, callback);
    } else if (intentName === 'GetDogWeight') {
        getDogWeight(intent, session, callback);
    } else if (intentName === 'GetDogBirthday') {
        getDogBirthday(intent, session, callback);
    }  else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }

}

function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handle = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, helpers.buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, helpers.buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
