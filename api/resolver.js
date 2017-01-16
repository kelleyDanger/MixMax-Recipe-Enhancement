var key = require('./key.js');
var request = require('request');
var _ = require('underscore');


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var ingredients = req.query.text.trim();
  console.log("INGREDIENT: " + ingredients);

  if (/^http:\/\/food2fork\.com\/\S+/.test(ingredients)) {
    // Special-case: handle strings in the special URL form that are suggested by the /typeahead
    // API. This is how the command hint menu suggests an exact Giphy image.
    handleIdString(ingredients.replace(/^http:\/\/food2fork\.com\//, ''), req, res);
  } else {
    // Else, if the user was typing fast and press enter before the /typeahead API can respond,
    // Mixmax will just send the text to the /resolver API (for performance). Handle that here.
    handleSearchString(ingredients, req, res);
  }
};

function handleIdString(id, req, res) {
  console.log("ID: " + id);
  console.log("REQ: " + req);
  console.log("RES: " + res);
  request({
    url: 'http://food2fork.com/api/get', //+ encodeURIComponent(id),
    qs: {
      key: key,
      rId: id
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    var recipe = response.body.recipe;
    console.log(recipe);

    var title = recipe.title;
    var publisher = recipe.publisher;
    var image_url = recipe.image_url;
    var source_url = recipe.source_url;
    var ingredients_list = recipe.ingredients;

    var list_html = "<ul>";
    ingredients_list.forEach(function(ingredient) {
      list_html += "<li>" + ingredient + "</li>"
    });
    list_html += "</ul>"

    var html =
      '<div>' +
        '<h2 style="display:inline;">' + title + '</h2><em> by ' + publisher + '</em>' +
        '<br><a href=' + source_url + '><img style="max-width:100%;" src=' + image_url + ' width="400px" /></a>' +
        '<h3>Ingredients List:</h3>' + list_html +
      '</div>';

      res.json({
      body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}

function handleSearchString(term, req, res) {
  request({
    url: 'http://food2fork.com/api/search',
    qs: {
      q: term,
      key: key
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    console.log("RESPONSE: " + response.body);
    var recipe = response.body.recipe;
    console.log("RECIPE: " + recipe);
    var html = '<img style="max-width:100%;" src="' + recipe.image_url + '" width="' + 600 + '"/>';
    res.json({
      body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}
