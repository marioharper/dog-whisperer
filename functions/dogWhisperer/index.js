'use strict';


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


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
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Talk to you later!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createSessionAttributes(dogName) {
    return {
        dogName,
    };
}

function getDogBreed(intent, session, callback){
    const cardTitle = intent.name;
    const dogNameSlot = intent.slots.Dog;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    let dogBreed = 'Golden Retriever';
    
    if (dogNameSlot) {
        const dogName = dogNameSlot.value;
        speechOutput = `${dogName} says: bark bark I am a ${dogBreed}.`;
    } else {
        speechOutput = "I'm not sure what your dogs name is. Please try again.";
        repromptText = "I'm not sure what your dogs name is.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogActivity(intent, session, callback){
    const cardTitle = intent.name;
    const dogNameSlot = intent.slots.Dog;
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dogNameSlot && activityDateSlot) {
        const dogName = dogNameSlot.value;
        const activityDate = activityDateSlot.value;
        
        speechOutput = `${dogName} says: bark bark ${activityDate} I slept a ton!`;
    } else {
        speechOutput = "I'm not sure what your dogs name is. Please try again.";
        repromptText = "I'm not sure what your dogs name is.";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
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
        sessionAttributes = createSessionAttributes(dogName);
        speechOutput = `I now know your dogs name is ${dogName}. I can now talk to 
            ${dogName} for you.`;
        repromptText = `You can ask me to say anything to ${dogName}, try something like
            what did you do yesterday?`;
    } else {
        speechOutput = "I'm not sure what your dogs name is. Please try again.";
        repromptText = `I'm not sure what your dogs name is. You can tell me which of your dogs
            to talk to by saying, talk to Max`;
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogNameFromSession(intent, session, callback) {
    let dogName;
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (session.attributes) {
        dogName = session.attributes.dogName;
    }

    if (dogName) {
        speechOutput = `Your dogs name is ${dogName}. Goodbye.`;
        shouldEndSession = true;
    } else {
        speechOutput = "I'm not sure what your dogs name is, what is it again?";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
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

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    //setDogInSession(intent, session, callback);

    if(intentName === 'TalkTo'){
        setDogInSession(intent, session, callback);
    } else if(intentName === 'GetDogBreed'){
        getDogBreed(intent, session, callback);
    } else if(intentName === 'GetDogActivity'){
        getDogActivity(intent, session, callback);
    }else {
        throw new Error('Invalid intent');
    }

    /* Dispatch to your skill's intent handlers
    if (intentName === 'MyColorIsIntent') {
        setDogInSession(intent, session, callback);
    } else if (intentName === 'WhatsMyColorIntent') {
        getColorFromSession(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }*/
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
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
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
