'use strict';

var FitBark = require('fitbark-node-client');
var fitBark = new FitBark(process.env.FITBARK_API_TOKEN);
var dateUtil = require('./utils/dateUtil');

module.exports = {
    getWelcomeResponse,
    handleSessionEndRequest,
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
    setDogInSession
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
}

function handleSessionEndRequest(intent, session, callback) {
    const cardTitle = 'Session Ended';
    let speechOutput = 'Closing Dog Whisperer';
    const dog = _getDogFromSession(intent, session, callback);
    const shouldEndSession = true;

    if (dog) {
        speechOutput = `${dog.name} says: Love you, talk to you later!`;
    }

    callback({}, _buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getDogBreed(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    let breed = `a ${dog.breed1.name}`;

    if (dog.breed2.name) {
        breed = `part ${dog.breed1.name} and part ${dog.breed2.name}`
    }

    speechOutput = `${dog.name} says: bark bark I am ${breed}.`;

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogMedicalConditions(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog.medical_conditions.length > 0) {
        speechOutput = `${dog.name} says: bark I am ${dog.medical_conditions[0].name}.`;
    } else {
        speechOutput = `${dog.name} says: nope, I do not have any medical conditions.`;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getBatteryLevel(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    let recommendation = '';
    if (dog.battery_level > 50) {
        recommendation = "doesn't need charging"
    } else if (dog.battery_level > 30) {
        recommendation = "should be charged soon"
    } else {
        recommendation = "needs to be charged"
    }

    speechOutput = `${dog.name} says: bow wow my battery is at ${dog.battery_level} percent. My FitBark ${recommendation}.`;

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogActivity(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function(activities){
            speechOutput = `${dog.name} says: I played for ${dateUtil.minutesToString(activities[0].min_play)}, was active for ${dateUtil.minutesToString(activities[0].min_active)}, and slept for ${dateUtil.minutesToString(activities[0].min_rest)}.`;
            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function(err){
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            callback(sessionAttributes,
                 _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    }
}

function getDogWeight(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog) {
        speechOutput = `${dog.name} says: bark bark I weigh ${dog.weight} ${dog.weight_unit}!`;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getSpayedOrNeutered(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
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

    if (!dog.neutered) {
        speechOutput = `${dog.name} says: woof woof no, I am not ${spayedOrNeutered}.`;
    } else {
        speechOutput = `${dog.name} says: woof woof I am a ${gender} dog so I am ${spayedOrNeutered}.`;
    }

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogBirthday(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    const age = dateUtil.yearDiff(new Date(dog.birth), new Date());

    speechOutput = `${dog.name} says: bark bark my birthday is ${dog.birth}. I will be turning ${age + 1}. What are you getting me?`;

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogAge(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    const ageMonths = dateUtil.monthDiff(new Date(dog.birth), new Date());
    let ageString;

    // under one year old, say months
    if(ageMonths === 1){
        ageString = `${ageMonths%12} month`
    } else if (ageMonths < 12){
        ageString = `${ageMonths%12} months`
    } else if (ageMonths < 24) {
        ageString = `${Math.floor(ageMonths/12)} year`
    } else {
        ageString = `${Math.floor(ageMonths/12)} years`
    }

    speechOutput = `${dog.name} says: I am ${ageString} old.`;

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogGender(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';
    let gender = ''; 

    if (dog.gender == 'M') {
        gender = 'male';
    } else {
        gender = 'female';
    }

    speechOutput = `${dog.name} says: I am a ${gender} dog.`;

    callback(sessionAttributes,
        _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getDogRestActivity(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function(activities){
            speechOutput = `${dog.name} says: I slept for ${dateUtil.minutesToString(activities[0].min_rest)}.`;

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function(err){
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            console.log(intent, err);
            callback(sessionAttributes,
                 _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }
}

function getDogPlayActivity(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function(activities){
            speechOutput = `${dog.name} says: I played for ${dateUtil.minutesToString(activities[0].min_play)}.`;

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function(err){
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            console.log(intent, err);
            callback(sessionAttributes,
                 _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }
}

function getDogActiveActivity(intent, session, callback) {
    const cardTitle = intent.name;
    const dog = _getDogFromSession(intent, session, callback);
    const activityDateSlot = intent.slots.Date;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (dog && activityDateSlot) {
        const activityDate = activityDateSlot.value;
        fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function(activities){
            speechOutput = `${dog.name} says: I was active for ${dateUtil.minutesToString(activities[0].min_active)}.`;

            callback(sessionAttributes,
                _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch(function(err){
            speechOutput = `Sorry, had trouble communicating with ${dog.name} about that.`;
            console.log(intent, err);
            callback(sessionAttributes,
                 _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }
}

function setDogInSession(intent, session, callback) {
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
        speechOutput = "I didn't catch which dog you wanted me to talk to. Please tell me by saying talk to charlie.";
        repromptText = "Please tell me which dog to talk to by saying talk to max."

        callback(sessionAttributes,
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function _getDogFromSession(intent, session, callback) {
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
            _buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
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