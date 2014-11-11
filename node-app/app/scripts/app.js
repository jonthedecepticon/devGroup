'use strict';
// ROUTING
angular.module('100App', [
	'ui.router', 'ui.bootstrap', 'firebase','xeditable','ngAnimate', 'onFinishRenderDirective'
]).config(function ($stateProvider, $urlRouterProvider) {
  // UI ROUTER
  $urlRouterProvider.otherwise('/');

  var nav = {
        templateUrl: 'views/nav.html',
        // controller: 'listCtrl',
        // resolve: {
        //   user: function (userService) {
        //     return userService.get();
        //   },
        //   loggedInUser: function (userService) {
        //     return userService.getLoggedInUser();
        //   }
        // }
      };
  var test = {
        templateUrl: 'views/hello.html',
        // controller: 'listCtrl',
        // resolve: {
        //   user: function (userService) {
        //     return userService.get();
        //   },
        //   loggedInUser: function (userService) {
        //     return userService.getLoggedInUser();
        //   }
        // }
      };
  var createModal = {
        templateUrl: 'views/createModal.html',
        // controller: 'listCtrl',
        // resolve: {
        //   user: function (userService) {
        //     return userService.get();
        //   },
        //   loggedInUser: function (userService) {
        //     return userService.getLoggedInUser();
        //   }
        // }
      };

  var itemModal = {
        templateUrl: 'views/itemModal.html',
        // controller: 'listCtrl',
        // resolve: {
        //   user: function (userService) {
        //     return userService.get();
        //   },
        //   loggedInUser: function (userService) {
        //     return userService.getLoggedInUser();
        //   }
        // }
      };

  var body = {
        templateUrl: 'views/main.html',
        controller: 'listCtrl',
        // resolve: {
        //   user: function (userService) {
        //     return userService.get();
        //   },
        //   loggedInUser: function (userService) {
        //     return userService.getLoggedInUser();
        //   }
        // }
      };

  var footer = {
        templateUrl: 'views/footer.html',
        // controller: 'NavCtrl',
        // resolve: {
        //   user: function (userService) {
        //     return userService.get();
        //   },
        //   loggedInUser: function (userService) {
        //     return userService.getLoggedInUser();
        //   }
        // }
      };

  $stateProvider
        .state('root', {
          url: '/',
          views: {
            nav: nav,
            body: body,
            createModal: createModal,
            footer: footer,
          }})
        .state('user', {
        url: "/{param:2}",
          views: {
            nav: nav,
            body: body,
            footer: footer,
          }})
  ;
});