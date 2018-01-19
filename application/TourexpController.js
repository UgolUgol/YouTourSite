myapp.controller('TourexpCtrl', ['$scope', 'betcosData', 'http_reserve', function($scope, betcosData, http_reserve){
	var vm = this;
	vm.modalShown = true;
	vm.showLoading = false;
	vm.showLogin = false;
	vm.showSMessage = false;

	vm.modalLoginCtrl = {};
	vm.modalQMCtrl = {};
	vm.toursList = betcosData.getData();
	vm.reserveList = {
		name: '', 
		email: '',
		phone: '911',
		tid: 0
	};
	vm.logException = {
		bad_name: 1,
		bad_mail: 2,
		all_right: 3
	};
	vm.resultMessage = '';

	vm.myInterval = -1;
	vm.noWrapSlides = false;
	vm.active = 0;
	var slides = vm.slides = [];
	var currIndex = 0;

	vm.addSlide = function(tid, path, name, stars, cost) {
		slides.push ({
			tid: tid,
		    image: 'images/hotels/' + path + '.jpg',
		    name: name,
		    stars: stars,
		    cost: cost,
		    height: 450,
		    id: currIndex++
		});
	};

	for(i in vm.toursList){
		vm.addSlide(vm.toursList[i]['TOUR_ID'], vm.toursList[i].IMGPATH, vm.toursList[i].NAME, vm.toursList[i].STARS, 
					vm.toursList[i].NIGHT_COST*vm.toursList[i].DAYS);
	};

	vm.currtour = function(tour) {
		var el = document.getElementById('login-btn');
		el.classList.remove("selectedbtn");
		void el.offsetWidth;
		el.classList.add("selectedbtn");
		vm.reserveList.tid = tour.tid;

	};

	vm.openLogin = function(){
		if(vm.reserveList.tid != 0){
			vm.showLogin = true;

			// delete animation of error buttons
			var elname = document.getElementById("name_icon");
			var elmail = document.getElementById("mail_icon");
			elname.classList.remove("throw-error-btn");
			elmail.classList.remove("throw-error-btn");
		}
	}

	vm.RightData = function(){
		if(!vm.reserveList.name){
			return vm.logException.bad_name;
		}
		else if(!vm.reserveList.email){
			return vm.logException.bad_mail;
		}
		else{
			return vm.logException.all_right;
		}
	}

	vm.throwButtonError = function(btn_id){
		var el = document.getElementById(btn_id);
		el.classList.remove("throw-error-btn");
		void el.offsetWidth;
		el.classList.add("throw-error-btn");
	}

	vm.makeReserve = function() {
		if(vm.RightData() == vm.logException.all_right){
			return new Promise((resolve) => {
				http_reserve.sendReserveData(vm.reserveList).then(function(response){
					resolve(response);
				}, function(error){
					resolve(error);
				});
			})
		}
		else if(vm.RightData() == vm.logException.bad_name){
			vm.throwButtonError("name_icon");
		}
		else {
			vm.throwButtonError("mail_icon");
		}
	}

	vm.successMessage = function(response){
		vm.modalLoginCtrl.export_exitanim(400).then(vm.modalLoginCtrl.export_hideModal);
		vm.showSMessage = true;
		vm.resultMessage = response.data.message;
	}

	vm.endReserve = function(){
		vm.modalQMCtrl.export_exitanim(400).then(vm.modalQMCtrl.export_hideModal);
	}


}])