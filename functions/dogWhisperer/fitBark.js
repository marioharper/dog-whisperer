var rp = require('request-promise');
var Promise = require('bluebird');
var API_BASE = 'https://app.fitbark.com/api/v2';
var AUTH_TOKEN = process.env.FITBARK_API_TOKEN;

module.exports = {
  getDog: getDog
}

function getDog(dogName) {

  return getDogs().then((dogs) => {
    for (var dog of dogs) {
      if (dog.name.toUpperCase() === dogName.toUpperCase()) {
        return dog;
      }
    }

    return null;
  });

}

function getDogs() {

  return getDogRelations().then((dogRelations) => {
    var dogs = [];
    dogRelations = dogRelations.dog_relations;

    console.log('dog relations', dogRelations);
    for (var dogRelation of dogRelations) {
      dogs.push(dogRelation.dog);
    }

    return dogs;
  });

}

function getDogRelations() {

  var options = {
    uri: API_BASE + '/dog_relations',
    headers: {
      'authorization': 'Bearer ' + AUTH_TOKEN
    },
    json: true
  };

  return rp(options);
}