'use strict';

/*
    This module provides text reponses for dog attributes.
*/

const dateUtil = require('./utils/dateUtil');
const DOG_NOISES = [
    'bow-wow',
    'bark bark',
    'bark',
    'woof woof',
    'woof',
    'ruff ruff',
    'rrowff rrowff'
];

module.exports = {
    dailyGoal,
    dailyGoalProgress,
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

//////////////////////////////////

function dailyGoal(dog){
    return _formatResponse(dog.name, `My daily goal is ${dog.daily_goal} barkpoints`);
}

function dailyGoalProgress(dog){
    const goal = dog.daily_goal;
    const progress = dog.activity_value;
    let response;

    if(progress >= goal){
        response = `I have `
    } else {
        response = `I have not yet `;
    }

    response += `reached my daily goal of ${goal} barkpoints. I am currently at ${progress} points`;

    return _formatResponse(dog.name, response);
}

function breed(dog) {
    let breed = `a ${dog.breed1.name}`;

    if (dog.breed2.name) {
        breed = `part ${dog.breed1.name} and part ${dog.breed2.name}`
    }

    return _formatResponse(dog.name, `I am ${breed}`);
}

function medicalConditions(dog) {
    let response = '';

    if (dog.medical_conditions.length > 0) {
        response = `I `
        dog.medical_conditions.forEach((condition, i) => {
            if(condition.name.toUpperCase() === "OVERWEIGHT"){
                response += `am ${condition.name} `;
            } else {
                response += `have ${condition.name} `;
            }

            if(dog.medical_conditions.length > 1 && i < dog.medical_conditions.length - 1){
                response += 'and ';
            }
        });
    } else {
        response = `Nope, I do not have any medical conditions`;
    }

    return _formatResponse(dog.name, response);
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

    return _formatResponse(dog.name, `My battery is at ${dog.battery_level} percent. My FitBark ${recommendation}`);
}

function weight(dog) {
    return _formatResponse(dog.name, `I weigh ${dog.weight} ${dog.weight_unit}`);
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
        response = `No, I am not ${spayedOrNeutered}`;
    } else {
        response = `Yes, I am ${spayedOrNeutered}`;
    }

    return _formatResponse(dog.name, response);
}

function birthday(dog) {
    const age = dateUtil.yearDiff(new Date(dog.birth), new Date());
    return _formatResponse(dog.name, `My birthday is ${dog.birth}. I will be turning ${age + 1}`);
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

    return _formatResponse(dog.name, `I am ${ageString} old`);
}

function gender(dog) {
    let gender = '';

    if (dog.gender == 'M') {
        gender = 'male';
    } else {
        gender = 'female';
    }

    return _formatResponse(dog.name, `I am a ${gender} dog`);
}

function activity(dog, activities) {
    return _formatResponse(dog.name, `I played for ${dateUtil.minutesToString(activities[0].min_play)}, was active for ${dateUtil.minutesToString(activities[0].min_active)}, and slept for ${dateUtil.minutesToString(activities[0].min_rest)}`);
}

function restActivity(dog, activities) {
    return _formatResponse(dog.name, `I slept for ${dateUtil.minutesToString(activities[0].min_rest)}`);
}

function playActivity(dog, activities) {
    return _formatResponse(dog.name, `I played for ${dateUtil.minutesToString(activities[0].min_play)}`);
}

function activeActivity(dog, activities) {
    return _formatResponse(dog.name, `I was active for ${dateUtil.minutesToString(activities[0].min_active)}`);
}

function _formatResponse(dogName, response){
    const formatted = `${dogName} says: ${_randomDogNoise()} ${response}.`;
    console.log('dog response: ', formatted);
    return formatted;
}

function _randomDogNoise(){
    return DOG_NOISES[Math.floor(Math.random()*DOG_NOISES.length)];
}
