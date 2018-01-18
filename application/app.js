var myapp =  angular.module("MyApp", ['ngRoute', 'ngAnimate', 'ngMaterial', 'ui.bootstrap','madvas.angular-globe', 'proton.multi-list-picker']);

myapp.directive('modalDialog', function($interval, $location) {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      control: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
    	scope.dialogStyle = {};
        scope.overlayStyle = {};
    	if (attrs.width)
    		scope.dialogStyle.width = attrs.width;
    	if (attrs.height)
    		scope.dialogStyle.height = attrs.height;
        if(attrs.bcolor)
            scope.overlayStyle['background-color'] = attrs.bcolor;
    	if (attrs.type)
    	{
    		if(attrs.type == 'country_info') {
    			scope.dialogStyle.top = '93%';
    			scope.dialogStyle.left = '50%';
    			scope.dialogStyle.opacity = '1.0';
    			scope.dialogStyle['animation-name'] = "slidein-ch";
    			scope.dialogStyle['marigin-bottom'] = '0';

                scope.overlayStyle['-webkit-animation'] = 'blacked-overlay 1.0s';
                scope.overlayStyle['background-color'] = 'rgba(34, 34, 34, 0.9)';

    		}
    	}
        //todo overlay transparancy
    	scope.exitanim = function(time) {
            if(attrs.type == 'country_info') {
                scope.dialogStyle['animation-name'] = "slideout-ch";
                scope.overlayStyle['-webkit-animation'] = 'unblacked-overlay 1.0s';
            }
            else {
                scope.dialogStyle['animation-name'] = "slideout";
                scope.overlayStyle['-webkit-animation'] = 'unblacked-overlay_map 1.0s';
            };
            scope.dialogStyle['opacity'] = "0";
            return new Promise((resolve) => $interval(resolve, time));
        };

        scope.hideModal = function() {
            scope.show = false;
            if(attrs.type == 'country_info') {
                scope.dialogStyle.opacity = '1.0';
                scope.dialogStyle['animation-name'] = "slidein-ch";

                scope.overlayStyle['-webkit-animation'] = 'blacked-overlay 1.0s';
                scope.overlayStyle['background-color'] = 'rgba(34, 34, 34, 0.9)';
            }
            else {
                scope.dialogStyle['animation-name'] = 'slidein';
                scope.dialogStyle['opacity'] = '0.6';

                scope.overlayStyle['background-color'] = attrs.bcolor;
                scope.overlayStyle['-webkit-animation'] = '';

                if(attrs.type == 'tour_params') {
                    $location.path('/main');
                    $location.replace();
                }
                if(attrs.type == 'tour_exp') {
                    $location.path('/tourparams');
                    $location.replace();
                }
            }
        }

        // functions on export
        scope.internalControl = scope.control;
        scope.internalControl.export_exitanim  = scope.exitanim;
        scope.internalControl.export_hideModal = scope.hideModal;
    },
    templateUrl: "directives/modalbox.html" 
  };
});

myapp.directive("navigator", function(){
	return {
		controller: "NavigatorCtrl",
		controllerAs: "navctrl",
		templateUrl: "directives/navigator.html"
	}
});

myapp.directive('svgMap', function($compile){
	return {
		restrict: 'A',
		templateUrl: 'images/europe_map.svg',
		link: function(scope, element, attrs) {

		}
	}
});

myapp.directive('region', function () {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {
            scope.country = element.attr("id");
            scope.regionClick = function () {
               	return scope.country;
            };
        }
    }
});