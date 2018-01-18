myapp.controller('MainCtrl', function ($scope) {
		var vm = this;
		vm.myInterval = 3000;
		vm.noWrapSlides = false;
		vm.active = 0;
		var slides = vm.slides = [];
		var currIndex = 0;

		vm.addSlide = function(path, country, txt) {
		    slides.push ({
		      image: 'images/' + path,
		      text: txt,
		      height: 680,
		      Country: country,
		      id: currIndex++
		    });
		  };

		  
		vm.addSlide('3.jpg', 'Argentina', 'Learn deep Patagonia today');
		vm.addSlide('2.jpg', 'USA', 'Wanna visit Usa today?');  
		vm.addSlide('1.jpg', 'Russia', 'Have your ever been in this place ?');  
 });