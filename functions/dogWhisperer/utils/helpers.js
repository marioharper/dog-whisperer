'use strict';

module.exports = {
    getAccessToken,
    buildSpeechletResponse
};

function getAccessToken(session, callback) {
    // check for FITBARK account
    const accessToken = session.user.accessToken;
    if (accessToken === undefined || accessToken === "" || accessToken === null) { // no access token
        const linkAccountResponseJSON = {
            outputSpeech: {
                type: "PlainText",
                text: "You must have a FitBark account to use the Dog Whisperer skill. Please use the Alexa app to link your Amazon account with your FitBark Account."
            },
            card: {
                type: "LinkAccount"
            },
            shouldEndSession: true
        };

        callback(session.attributes, linkAccountResponseJSON);
    } else {
        return accessToken;
    }
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output
        },
        card: {
            type: 'Simple',
            title: title,
            content: output
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
