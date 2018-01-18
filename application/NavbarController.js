myapp.controller('NavigatorCtrl', function($scope, $location, http_getCountry){
	var vm = this;
	vm.modalCtrl = {};  // export function form link's directive
	vm.modalCountryCtrl = {};

	vm.modalShown = false;
	vm.modalCountryShown = false;

	vm.choosenCountry = "";
	vm.choosenCID = -1;
	vm.acceptedCountry = {};
	vm.last = 'noaccept';

	vm.openFind = function() {
		vm.modalShown = !vm.modalShown;
		vm.acceptedCountry['border-bottom'] = '3px solid #e66c7e';
		vm.last = 'noaccept';
	};

	vm.changeCountry = function(country) {
		vm.choosenCountry = country;
		vm.modalCountryShown = true;
		vm.double_click = 0;
	}

	vm.checkCountry = function(country) {
		return new Promise(resolve => {
			http_getCountry.getData(country).then(function(response){
				if(response.status == 200) {
					if(vm.last == 'noaccept')
					{
						vm.choosenCID = response.data['cid'];
						vm.acceptedCountry['border-bottom'] = ' 3px solid #253';
						vm.acceptedCountry['-webkit-animation'] = 'toaccept 1.0s';
						vm.last = 'accept';
					}
				}
			}, function(error) {
				if(error.status == 404) {
					if(vm.last =='accept')
					{
						vm.acceptedCountry['border-bottom'] = '3px solid #e66c7e';
						vm.acceptedCountry['-webkit-animation'] = 'fromaccept 1.0s';
						vm.last = 'noaccept';
					}
				}
				if(error.status == 500) {
					if(vm.last == 'accept')
					{
						vm.acceptedCountry['border-bottom'] = '3px solid #e66c7e';
						vm.acceptedCountry['-webkit-animation'] = 'fromaccept 1.0s';
						vm.last == 'noaccept';
					}			
				}
			});
			resolve();
		})
		
	}

	vm.gotoTours = function(country) {
		if(vm.last == 'accept') {
			vm.last = 'noaccept';
			vm.checkCountry(country).then(function(){
				// close main modal
				vm.modalCtrl.export_exitanim(400).then(vm.modalCtrl.export_hideModal);

				// close modal with country
				vm.modalCountryCtrl.export_exitanim(400).then(vm.modalCountryCtrl.export_hideModal);

				// change location
				$location.path('/tourparams');
				$location.replace(); 
			});
		}
	}

});