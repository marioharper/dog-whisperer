'use strict';

/*
    This module handles all session based requests. All functions assume
    they are in the context of an ongoing conversation. Thus, the dog in question 
    is retrieved/set in the session. 
*/

var FitBark = require('fitbark-node-client');
var dogResponses = require('./dogResponses');
var dateUtil = require('./utils/dateUtil');

const CACHED_RESPONSES = {
    NO_DOG: "I didn't understand which dog you wanted me to talk to. Which dog would you like to talk to?",
    GENERAL_SERVICE_ERROR: "Sorry, there was an issue retrieving that information from FitBark.",
    EXAMPLE_REQUESTS: [
        "What did you do today?",
        "What is your breed?",
        "Did you reach your daily goal?",
        "What is your daily goal?",
        "How much do you weigh?",
        "Did you sleep today?"
    ],
    getRandomExample: function(){
        return this.EXAMPLE_REQUESTS[Math.floor(Math.random()*this.EXAMPLE_REQUESTS.length)]
    },
}

module.exports = {
    setDogName,
    getDogDailyGoal,
    getDogDailyGoalProgress,
    getDogBreed,
    getDogMedicalConditions,
    getBatteryLevel,
    getDogWeight,
    getSpayedOrNeutered,
    getDogBirthday,
    getDogAge,
    getDogGender,
    getDogActivity,
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
    let shouldEndSession = false;
    let speechOutput = '';

    if (dogNameSlot && dogNameSlot.value) {
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
        speechOutput = CACHED_RESPONSES.NO_DOG;
        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogDailyGoal(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.dailyGoal(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogDailyGoalProgress(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.getDogDailyGoalProgress(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogBreed(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.breed(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogMedicalConditions(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.medicalConditions(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getBatteryLevel(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.batteryLevel(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogWeight(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(session);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    if (dog){
        speechOutput = dogResponses.weight(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getSpayedOrNeutered(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';
    
    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.spayedOrNeutered(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogBirthday(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.birthday(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogAge(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.age(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogGender(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';
    
    const dog = _getDogFromSession(session);

    if (dog){
        speechOutput = dogResponses.gender(dog) + ` You can now ask ${dog.name} another question.`;
        repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
    } else {
        speechOutput = CACHED_RESPONSES.NO_DOG;
        repromptText = CACHED_RESPONSES.NO_DOG;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
};

function getDogActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    try{
        if(!dog){
            throw new Error('no dog');
        }

        activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset*1000);

        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.activity(dog, activities) + ` You can now ask ${dog.name} another question.`;
            repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }catch(err){
        if(err.message === 'no dog'){
            speechOutput = CACHED_RESPONSES.NO_DOG;
            repromptText = CACHED_RESPONSES.NO_DOG;
        } else {
            speechOutput = CACHED_RESPONSES.GENERAL_SERVICE_ERROR;
            shouldEndSession = true;
            console.log(intent, err);
        }

        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogRestActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    try{
        if(!dog){
            throw new Error('no dog');
        }

        activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset*1000);

        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.activeActivity(dog, activities) + ` You can now ask ${dog.name} another question.`;
            repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }catch(err){
        if(err.message === 'no dog'){
            speechOutput = CACHED_RESPONSES.NO_DOG;
            repromptText = CACHED_RESPONSES.NO_DOG;
        } else {
            speechOutput = CACHED_RESPONSES.GENERAL_SERVICE_ERROR + ' Ending your session.';
            shouldEndSession = true;
            console.log(intent, err);
        }

        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogPlayActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    try{
        if(!dog){
            throw new Error('no dog');
        }

        activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset*1000);

        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.activeActivity(dog, activities) + ` You can now ask ${dog.name} another question.`;
            repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }catch(err){
        if(err.message === 'no dog'){
            speechOutput = CACHED_RESPONSES.NO_DOG;
            repromptText = CACHED_RESPONSES.NO_DOG;
        } else {
            speechOutput = CACHED_RESPONSES.GENERAL_SERVICE_ERROR + ' Ending your session.';
            shouldEndSession = true;
            console.log(intent, err);
        }

        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogActiveActivity(intent, session, callback) {
    const fitBark = new FitBark(_getAccessToken(session, callback));
    const cardTitle = intent.name;
    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    let repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    const dog = _getDogFromSession(session);

    try{
        if(!dog){
            throw new Error('no dog');
        }

        activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset*1000);

        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
            speechOutput = dogResponses.activeActivity(dog, activities) + ` You can now ask ${dog.name} another question.`;
            repromptText = `Ask ${dog.name} something else like, ${CACHED_RESPONSES.getRandomExample()}`
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }catch(err){
        if(err.message === 'no dog'){
            speechOutput = CACHED_RESPONSES.NO_DOG;
            repromptText = CACHED_RESPONSES.NO_DOG;
        } else {
            speechOutput = CACHED_RESPONSES.GENERAL_SERVICE_ERROR + ' Ending your session.';
            shouldEndSession = true;
            console.log(intent, err);
        }

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