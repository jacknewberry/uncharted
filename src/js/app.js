var myapp = angular.module('app', ["ui.router"])

myapp.config(function($stateProvider, $urlRouterProvider){

      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/finance")

      $stateProvider
        .state('finance', {
            url: "/finance",
            templateUrl: "finance.html"
        })

        .state('vitalsigns', {
            url: "/vitalsigns",
            templateUrl: "vitalsigns.html"
        })
    })
