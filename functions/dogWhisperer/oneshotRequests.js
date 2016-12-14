'use strict';

const helpers = require('./utils/helpers');

/*
    This module handles all one-shot requests. All functions assume all
    variables necessary to handle the request are provided in the intent.
    They only pull the FitBark access token from the session.
*/

const FitBark = require('fitbark-node-client');
const dogResponses = require('./dogResponses');
const dateUtil = require('./utils/dateUtil');

const CACHED_RESPONSES = {
    NO_DOG: "I couldn't understand which dog you wanted me to talk to. Please specify which dog your question pertains to. Ask something like, what did charlie do yesterday?"
}

module.exports = {
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

//////////////////////////////////

function getDogDailyGoal(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.dailyGoal(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogDailyGoalProgress(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.dailyGoalProgress(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogBreed(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.breed(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogMedicalConditions(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.medicalConditions(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getBatteryLevel(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.batteryLevel(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogWeight(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.weight(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getSpayedOrNeutered(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.spayedOrNeutered(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogBirthday(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.birthday(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogAge(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.age(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            }

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogGender(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            if (dog) {
                speechOutput = dogResponses.gender(dog);
            } else {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`;
            } 

            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }).catch((err) => {
            speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
            console.log(intent, err);
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogActivity(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            
            if (!dog){
                throw new Error(`unrelated dog`)
            }

            activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset * 1000);
            fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
                speechOutput = dogResponses.activity(dog, activities);
                console.log(activities);
                callback(sessionAttributes,
                    helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });

        }).catch((err) => {
            if (err.message === 'unrelated dog') {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`
            } else {
                speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
                console.log(intent, err);
            }
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });

    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogRestActivity(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            
            if (!dog){
                throw new Error(`unrelated dog`)
            }

            activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset * 1000);
            fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
                speechOutput = dogResponses.restActivity(dog, activities);
                console.log(activities);
                callback(sessionAttributes,
                    helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });

        }).catch((err) => {
            if (err.message === 'unrelated dog') {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`
            } else {
                speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
                console.log(intent, err);
            }
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });


    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogPlayActivity(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            
            if (!dog){
                throw new Error(`unrelated dog`)
            }

            activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset * 1000);
            fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
                speechOutput = dogResponses.playActivity(dog, activities);
                console.log(activities);
                callback(sessionAttributes,
                    helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });

        }).catch((err) => {
            if (err.message === 'unrelated dog') {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`
            } else {
                speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
                console.log(intent, err);
            }
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });


    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function getDogActiveActivity(intent, session, callback) {
    const fitBark = new FitBark(helpers.getAccessToken(session, callback));
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = true;
    let speechOutput = '';

    // if not supplied, default to today
    let activityDate = intent.slots.Date && intent.slots.Date.value || new Date();
    const dogNameSlot = intent.slots.Dog;

    if (dogNameSlot && dogNameSlot.value) {
        const dogName = _formatDogName(dogNameSlot.value);

        fitBark.getDog(dogName).then((dog) => {
            
            if (!dog){
                throw new Error(`unrelated dog`)
            }

            activityDate = dateUtil.utcToDogLocal(new Date(activityDate), dog.tzoffset * 1000);
            fitBark.getActivitySeries(dog.slug, activityDate, activityDate, 'DAILY').then(function (activities) {
                speechOutput = dogResponses.activeActivity(dog, activities);
                console.log(activities);
                callback(sessionAttributes,
                    helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });

        }).catch((err) => {
            if (err.message === 'unrelated dog') {
                speechOutput = `I did not recognize ${dogName} as a dog related to you. Please try talking to a dog you are related to.`
            } else {
                speechOutput = `Sorry, having a little trouble talking to ${dogName} at the moment.`;
                console.log(intent, err);
            }
            callback(sessionAttributes,
                helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });


    } else {
        speechOutput = CACHED_RESPONSES.ONESHOT_NO_DOG;
        callback(sessionAttributes,
            helpers.buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
};

function _formatDogName(dogName) {
    return dogName.replace("'s", "");
}
