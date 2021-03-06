var key = require('./key.js');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var ingredients = req.query.text.trim();
  console.log("INGREDIENTS: " + ingredients);
  if (!ingredients) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }
  request ({
    url: 'http://food2fork.com/api/search',
    qs: {
      key: key,
      q: ingredients,
      sort: "r"
    },
    json: true,
    timeout: 10 * 100
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body ) {
      res.status(500).send('Error');
      return;
    }
    if (!response.body.recipes) {
      return "Sorry, no recipes were found.";
    }
    var results = _.chain(response.body.recipes)
      .filter(function(recipe){
        return recipe.image_url && recipe.source_url;
      })
      .map(function(recipe){
        return {
          title: "<img style='height:40px;' src='" + recipe.image_url + "'></br><em>" + recipe.title + "</em>",
          text: "http://food2fork.com/" + recipe.recipe_id
        };
      })
      .value();

    if (results.length === 0) {
      res.json([{
        title: '<em>Sorry, no results. Try again!</em>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });
};
