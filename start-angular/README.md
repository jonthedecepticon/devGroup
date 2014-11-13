
Hackathon Starter Angular [![Dependency Status](https://david-dm.org/squeezeday/hackathon-starter-angular.png?theme=shields.io)](https://david-dm.org/sahat/hackathon-starter)
=================
A boilerplate for **Node.js** web applications - with Angular JS.

No live demo yet..

I really like the work by Sahat Yalkabov with https://github.com/sahat/hackathon-starter
Even though I know there are several node-express-angular-mongodb boilerplates out there, here's my contribution. I wanted to be able to mix Angular and static pages in a single site. Also, I prefer to split Angular actions into separate modules.

### Routes are by default static and serve jade templates. To "angularify" a route:
1. Create an angular module for it (see public/js/modules.api.js)
... angular.module('myApp.modules.api', [])
...
...$routeProvider
... .when('/api', {
...	templateUrl: 'views/api.html',

2. Create an HTML partial in public/views/ which Angular can deliver

3. Add angularApp to the view data of the route's callback as such
... exports.getApi = function(req, res) {
...   res.render('api/index', {
...   title: 'API Browser'
...	  ,angularApp: 'myApp'
...  });
... };

Legacy browsers and crawlers will still be served static HTML while newer browsers will show your interactive HTML 5 web app.


License
-------
The MIT License (MIT)

Copyright (c) 2014 Sahat Yalkabov, Michael Svanström

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
