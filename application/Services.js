myapp.service('http_getCountry', function($http){
	this.getData = function(country)
	{
		return $http({
			url: '/find_tours/' + country,
			method: 'GET'
		})
	};
});

myapp.service('http_getTours', function($http) {
	this.getCities = function(country){
		return $http({
			url: '/find_cities/' + country,
			method: 'GET'
		})
	};
	this.getResult = function(tour_options){
		return $http({
			url: '/find',
			data: tour_options,
			method: 'POST'
		})
	}
});

myapp.service('http_reserve', function($http){
	this.sendReserveData = function(reserve_options){
		return $http({
			url: '/reserve',
			data: reserve_options,
			method: 'POST'
		})
	}
});


myapp.service('betcosData', function() {
	var data;

	var addData = function(newObj) {
		data.push(newObj);
	}

	var getData = function(){
		return data;
	}

	var deleteData = function(){
		data = [];
	}

	return {
		addData: addData,
		getData: getData, 
		deleteData: deleteData
	};
});

