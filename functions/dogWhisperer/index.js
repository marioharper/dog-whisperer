'use strict';

var DogWhisperer = require('./dogWhisperer');

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
    const dogWhisperer = new DogWhisperer();
    dogWhisperer.getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
    let dogWhisperer;

    // check for FITBARK account
    const accessToken = session.user.accessToken;
    if(!accessToken){ // no access token
        const linkAccountResponseJSON = {
            "version": "1.0",
            "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": "You must have a FitBark account to use this skill. Please use the Alexa app to link your Amazon account with your FitBark Account."
            },
            "card": {
                "type": "LinkAccount"
            },
            "shouldEndSession": true
            }
        };
    
        callback(session.attributes, linkAccountResponseJSON);
    }else {
        // use access token as FitBark API key
        dogWhisperer = new DogWhisperer(accessToken);
    }

    if (intentName === 'SetDogName') {
        dogWhisperer.setDogInSession(intent, session, callback);
    } else if (intentName === 'GetDogMedicalConditions') {
        dogWhisperer.getDogMedicalConditions(intent, session, callback);
    } else if (intentName === 'GetDogBreed') {
        dogWhisperer.getDogBreed(intent, session, callback);
    } else if (intentName === 'GetDogActivity') {
        dogWhisperer.getDogActivity(intent, session, callback);
    } else if (intentName === 'GetBatteryLevel') {
        dogWhisperer.getBatteryLevel(intent, session, callback);
    } else if (intentName === 'GetSpayedOrNeutered') {
        dogWhisperer.getSpayedOrNeutered(intent, session, callback);
    } else if (intentName === 'GetDogWeight') {
        dogWhisperer.getDogWeight(intent, session, callback);
    } else if (intentName === 'GetDogBirthday') {
        dogWhisperer.getDogBirthday(intent, session, callback);
    } else if (intentName === 'GetDogAge') {
        dogWhisperer.getDogAge(intent, session, callback);
    } else if (intentName === 'GetDogGender') {
        dogWhisperer.getDogGender(intent, session, callback);
    } else if (intentName === 'GetDogRestActivity') {
        dogWhisperer.getDogRestActivity(intent, session, callback);
    } else if (intentName === 'GetDogPlayActivity') {
        dogWhisperer.getDogPlayActivity(intent, session, callback);
    } else if (intentName === 'GetDogActiveActivity') {
        dogWhisperer.getDogActiveActivity(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        dogWhisperer.getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        dogWhisperer.handleSessionEndRequest(intent, session, callback);
    } else {
        throw new Error('Invalid intent');
    }

}

function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
}

// --------------------------------------------------------

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse
    };
}

