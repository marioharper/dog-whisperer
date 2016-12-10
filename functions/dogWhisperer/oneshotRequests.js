'use strict';

/*
    This module handles all one-shot requests. All functions assume all
    variables necessary to handle the request are provided in the intent.
    They only pull the FitBark access token from the session.
*/

var FitBark = require('fitbark-node-client');
var dogResponses = require('./dogResponses');

const CACHED_RESPONSES = {
 NO_DOG: "I didn't catch which dog you wanted me to talk to. Please specify which dog your question pertains to. Ask something like, what did charlie do yesterday?"
}

module.exports = {
    getDogBreed,
    getDogMedicalConditions    
};

//////////////////////////////////

function getDogBreed(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.breed(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogMedicalConditions(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.medicalConditions(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function _getAccessToken(session, callback) {
    // check for FITBARK account
    const accessToken = session.user.accessToken;
    if (!accessToken) { // no access token
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
    } else {
        return accessToken;
    }
}

function _formatDogName(dogName) {
    return dogName.replace("'s", "");
}

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
