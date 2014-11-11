// Node Controller to serve up HTML

exports.index = function(req, res) {
  res.sendfile('views/login.html');
};