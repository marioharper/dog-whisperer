'use strict';

var oneshot = require('./oneshotRequests');
var conversation = require('./conversationRequests');

// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handle = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        if (event.session.application.applicationId !== 'amzn1.ask.skill.50a37bb7-6b6c-4a7a-8bbe-d38ddb9d43ef') {
             callback('Invalid Application ID');
        }

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
    getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    if (intentName === 'SetDogName') {
        conversation.setDogName(intent, session, callback);
    } else if (intentName === 'GetDogMedicalConditions') {
        conversation.getDogMedicalConditions(intent, session, callback);
    } else if (intentName === 'OneshotGetDogMedicalConditions') {
        oneshot.getDogMedicalConditions(intent, session, callback);
    } else if (intentName === 'GetDogBreed') {
        conversation.getDogBreed(intent, session, callback);
    } else if (intentName === 'OneshotGetDogBreed') {
        oneshot.getDogBreed(intent, session, callback);
    } else if (intentName === 'GetDogActivity') {
        conversation.getDogActivity(intent, session, callback);
    } else if (intentName === 'GetBatteryLevel') {
        conversation.getBatteryLevel(intent, session, callback);
    } else if (intentName === 'GetSpayedOrNeutered') {
        conversation.getSpayedOrNeutered(intent, session, callback);
    } else if (intentName === 'GetDogWeight') {
        conversation.getDogWeight(intent, session, callback);
    } else if (intentName === 'GetDogBirthday') {
        conversation.getDogBirthday(intent, session, callback);
    } else if (intentName === 'GetDogAge') {
        conversation.getDogAge(intent, session, callback);
    } else if (intentName === 'GetDogGender') {
        conversation.getDogGender(intent, session, callback);
    } else if (intentName === 'GetDogRestActivity') {
        conversation.getDogRestActivity(intent, session, callback);
    } else if (intentName === 'GetDogPlayActivity') {
        conversation.getDogPlayActivity(intent, session, callback);
    } else if (intentName === 'GetDogActiveActivity') {
        conversation.getDogActiveActivity(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(intent, session, callback);
    } else {
        throw new Error('Invalid intent');
    }

}

function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    handleSessionEndRequest(intent, session, callback);
}

// --------------------------------------------------------

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse
    };
}

function getWelcomeResponse(callback) {
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the Alexa Dog Whisperer skill. ' +
        'Please tell me which of your dogs you would like to talk to by saying, talk to Max';
    const repromptText = 'Please tell which dog to talk to by saying, ' +
        'talk to Charlie';
    const shouldEndSession = false;

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function handleSessionEndRequest(intent, session, callback) {
    const cardTitle = 'Session Ended';
    let speechOutput = 'Closing Dog Whisperer';
    const shouldEndSession = true;

    callback({}, _buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
};

function _buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText
            },
        },
        shouldEndSession
    };
}


