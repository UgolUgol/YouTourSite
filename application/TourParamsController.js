myapp.controller('TourParamsCtrl', ['$scope', '$interval', '$location', 'http_getTours', 'betcosData',
									  function($scope, $interval, $location, http_getTours, betcosData) {
	var vm = this;

	//  show modal
	vm.modalShown = true;
	vm.showLoading = false;

	// import functions from link
	vm.modalCtrl = {};	

	//country name
	vm.country = "";

	// list of cities;
	vm.citiesdata = [];
	vm.cnames = [];
	vm.tour_request = {
		cid: 0,
		stars: 0,
		days: 0,
		food_type: ''
	};

	// server answer
	vm.tourfind_result = [];

	//parameters
	vm.city = '';
	vm.cid = -1;


	// show selector
	vm.showOptions = true;
	vm.hotelsLimit = 10;

	vm.findCities = function(cid) {
		http_getTours.getCities(cid).then(function(response){
			if(response.status == 200) {
				for(i in response.data) {
					vm.citiesdata.push({
						id: i,
						cid: response.data[i].cid,
						cname: response.data[i].name
					});
					vm.cnames.push(response.data[i].name);
					if(vm.cnames[i].length > 8) {
						vm.cnames[i] = vm.cnames[i].substr(0, 8);
					}
				}
			}
		}, 
		function(error) {
			if(error.status == 404){
				//todo 
				alert("her1");
			}
			if(error.status == 500) {
				//todo
				alert("her2");
			}
		});
	};

	vm.uploadCities = function() {
		return vm.cnames;
	};
	vm.TourOptions = function()
	{
		vm.showOptions = true;
	};

	vm.findTours = function() {
		for(i in vm.citiesdata) {
			if(vm.cnames[i] == vm.city) {
				vm.tour_request.cid = vm.citiesdata[i].cid;
				break;
			}
		}
		vm.showLoading = true;
		betcosData.deleteData();
		return new Promise((resolve) => {
			http_getTours.getResult(vm.tour_request).then(function(response){
				for(i in response.data) {
					betcosData.addData(response.data[i]);
				}
			},
			function(error) {
				if(error.status == 404){
					//todo 
					alert("her1");
				}
				if(error.status == 500) {
					//todo
					alert("her2");
				}
			});
			return $interval(resolve, 1000);
		});
	};

	vm.gotoToursExp = function() {
		vm.showLoading = false;
		$location.path('/tourexp');
		$location.replace(); 
	}; 

}])