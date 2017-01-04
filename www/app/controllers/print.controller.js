(function() {
	"use strict";

	angular
		.module('app')
		.controller("PrintController", controller);

	controller.$inject = ['printService'];

	function controller(printService) {
		var vm = this;
		vm.today = new Date();
		vm.print = print;

		function print() {
			var printContent = angular.element(document.getElementById("printContent"));
			console.log(printContent.html());
			printService.print(printContent.html());
		}
	}
})();