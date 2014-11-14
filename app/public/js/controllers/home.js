//Controller added by Jon -- CURRENTLY NOT DOING ANYTHING


/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};
