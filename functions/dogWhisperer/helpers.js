module.exports = {
  buildSpeechletResponse: buildSpeechletResponse,
  buildResponse: buildResponse,
  calculateAge: calculateAge,
  minutesToString: minutesToString
}

function calculateAge(birthday){
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function minutesToString(minutes){
    var hours = Math.floor( minutes / 60);          
    var minutes = minutes % 60;
    var message = `${minutes} minutes`

    if (hours !== 0){
        message = `${hours} hours and ${message}`
    }

    return message;
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
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

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse
    };
}