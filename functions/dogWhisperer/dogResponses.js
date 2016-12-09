'use strict';

/*
    This module provides text reponses for dog attributes.
*/

var dateUtil = require('./utils/dateUtil');

module.exports = {
    breed,
    medicalConditions,
    batteryLevel,
    activity,
    weight,
    spayedOrNeutered,
    birthday,
    age,
    gender,
    restActivity,
    playActivity,
    activeActivity
};

function breed(dog) {
    let breed = `a ${dog.breed1.name}`;

    if (dog.breed2.name) {
        breed = `part ${dog.breed1.name} and part ${dog.breed2.name}`
    }

    return `I am ${breed}`;
}

function medicalConditions(dog) {
    let response = '';

    if (dog.medical_conditions.length > 0) {
        response = `I am ${dog.medical_conditions[0].name}`;
    } else {
        response = `Nope, I do not have any medical conditions`;
    }

    return response;
}

function batteryLevel(dog) {
    let recommendation = '';

    if (dog.battery_level > 50) {
        recommendation = "doesn't need charging"
    } else if (dog.battery_level > 30) {
        recommendation = "should be charged soon"
    } else {
        recommendation = "needs to be charged"
    }

    return `My battery is at ${dog.battery_level} percent. My FitBark ${recommendation}`;
}

function activity(activities) {
    return `I played for ${dateUtil.minutesToString(activities[0].min_play)}, was active for ${dateUtil.minutesToString(activities[0].min_active)}, and slept for ${dateUtil.minutesToString(activities[0].min_rest)}`;
}

function weight(dog) {
    return `I weigh ${dog.weight} ${dog.weight_unit}`;
}

function spayedOrNeutered(dog) {
    let spayedOrNeutered = '';
    let gender = '';
    let response = '';

    if (dog.gender == 'M') {
        gender = 'male';
        spayedOrNeutered = 'neutered';
    } else {
        gender = 'female';
        spayedOrNeutered = 'spayed';
    }

    if (!dog.neutered) {
        response = `${dog.name} says: woof woof no, I am not ${spayedOrNeutered}.`;
    } else {
        response = `${dog.name} says: woof woof I am a ${gender} dog so I am ${spayedOrNeutered}.`;
    }

    return response;
}

function birthday(dog) {
    const age = dateUtil.yearDiff(new Date(dog.birth), new Date());
    return `My birthday is ${dog.birth}. I will be turning ${age + 1}`;
}

function age(dog) {
    const ageMonths = dateUtil.monthDiff(new Date(dog.birth), new Date());
    let ageString;

    // under one year old, say months
    if (ageMonths === 1) {
        ageString = `${ageMonths % 12} month`
    } else if (ageMonths < 12) {
        ageString = `${ageMonths % 12} months`
    } else if (ageMonths < 24) {
        ageString = `${Math.floor(ageMonths / 12)} year`
    } else {
        ageString = `${Math.floor(ageMonths / 12)} years`
    }

    return `I am ${ageString} old`;
}

function gender(dog) {
    let gender = '';

    if (dog.gender == 'M') {
        gender = 'male';
    } else {
        gender = 'female';
    }

    return `I am a ${gender} dog`;
}

function restActivity(activities) {
    return `I slept for ${dateUtil.minutesToString(activities[0].min_rest)}`;
}

function playActivity(dog) {
    return `I played for ${dateUtil.minutesToString(activities[0].min_play)}`;
}

function activeActivity(dog) {
    return `I was active for ${dateUtil.minutesToString(activities[0].min_active)}.`;
}