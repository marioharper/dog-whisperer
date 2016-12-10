'use strict';

var FitBark = require('fitbark-node-client');
var dogResponses = require('./dogResponses');

const CACHED_RESPONSES = {
    NO_DOG: "I didn't catch which dog you wanted me to talk to. Please tell me by saying talk to charlie."
}

module.exports = {
    setDogName,
    getDogBreed,
    getDogMedicalConditions,
    getBatteryLevel,
    getDogActivity,
    getDogWeight,
    getSpayedOrNeutered,
    getDogBirthday,
    getDogAge,
    getDogGender,
    getDogRestActivity,
    getDogPlayActivity,
    getDogActiveActivity,
};

//////////////////////////////

function setDogName(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    const dogNameSlot = intent.slots.Dog;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    if (dogNameSlot) {
        const dogName = dogNameSlot.value;

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                sessionAttributes = _createSessionAttributes(dog);
                speechOutput = `I can now speak to ${dog.name} for you. Say something like, what did you do yesterday?`;
                repromptText = `You can ask me to say anything to ${dog.name}, try something like what did you do yesterday?`;
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
                repromptText = `You can only talk to dogs you have a relation to. Please tell me which dog to talk to by saying, talk to maxwell`;
            }

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = _noDogNameReponse();
        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogBreed(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.breed(dog);
    } else {
        speechOutput = CACHED_RESPONSES.CONVERSATION_NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogMedicalConditions(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.medicalConditions(dog);
    } else {
        speechOutput = CACHED_RESPONSES.CONVERSATION_NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getBatteryLevel(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog) {
        speechOutput = dogResponses.batteryLevel(dog);
    } else {
        speechOutput = CACHED_RESPONSES.CONVERSATION_NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.activity(activities);
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function (err) {
            console.log(intent, err);
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }
};

function getDogWeight(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(session);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog) {
        speechOutput = dogResponses.weight(dog);
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getSpayedOrNeutered(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    
    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.spayedOrNeutered(dog);
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogBirthday(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog) {
        speechOutput = dogResponses.birthday(dog);
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogAge(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.age(dog);
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogGender(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    
    const dog = _getDogFromSession(session);

    if (dog) {
        speechOutput = dogResponses.gender(dog);
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogRestActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    const dog = _getDogFromSession(session);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.restActivity(activities);
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function (err) {
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            console.log(intent, err);
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }
};

function getDogPlayActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    const dog = _getDogFromSession(session);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.playActivity(activities);

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function (err) {
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            console.log(intent, err);
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }
};

function getDogActiveActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    const dog = _getDogFromSession(session);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.activeActivity(activities);

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function (err) {
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            console.log(intent, err);
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
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

function _getDogFromSession(session) {
    let dog;

    if (session.attributes) {
        dog = session.attributes.dog;
    }

    return dog;
}

function _createSessionAttributes(dog) {
    return {
        dog,
    };
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