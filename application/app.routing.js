myapp.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
    .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
    .when('/tourparams', {
    	templateUrl: 'views/tourparams.html',
    	controller: 'TourParamsCtrl',
    	controllerAs: 'tparCtrl'
    })
    .when('/tourexp', {
        templateUrl: 'views/tourexp.html',
        controller: 'TourexpCtrl',
        controllerAs: 'texpCtrl'
    })
	.otherwise('/main');
});