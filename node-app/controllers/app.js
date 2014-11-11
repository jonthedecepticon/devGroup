// Node Controller to serve up HTML

exports.index = function(req, res) {
  res.render('app', {
    title: 'Home'
  });
};