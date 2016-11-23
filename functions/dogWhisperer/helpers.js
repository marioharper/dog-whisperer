module.exports = {
  buildSpeechletResponse: buildSpeechletResponse,
  buildResponse: buildResponse,
  yearDiff: yearDiff,
  monthDiff: monthDiff,
  minutesToString: minutesToString
}

function yearDiff(d1, d2){
    var difMs = d2.getTime() - d1.getTime();
    var difDate = new Date(difMs);
    return Math.abs(difDate.getUTCFullYear() - 1970);
}

function monthDiff(d1, d2){
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
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