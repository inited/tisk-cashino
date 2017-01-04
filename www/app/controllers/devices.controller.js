(function() {
	"use strict";

	angular
		.module('app')
		.controller("DevicesController", controller);

	controller.$inject = ['$rootScope', '$interval', '$timeout', '$scope', 'bluetoothService'];

	function controller($rootScope, $interval, $timeout, $scope, bluetoothService) {
		var vm = this;
		vm.devices = [];
		vm.initializing = true;
		vm.disabled = false;
		vm.connected = null;
		vm.connecting = null;

		vm.connect = connect;
		vm.disconnect = disconnect;

		var scanOptions = {
			allowDuplicates:false,
			scanMode: bluetoothle.SCAN_MODE_BALANCED
		};

		bluetoothle.isInitialized(function(response) {
			if(response.isInitialized) {
				console.log("Scanning for devices");
				scanForDevices()
			}
		});

		$rootScope.$on("bluetoothinitialized", function() {
			scanForDevices();
		});

		$rootScope.$on("bluetoothdisabled", function() {
			vm.disabled = true;
		});

		function connect(device) {
			vm.connecting = device;
			bluetoothService.connect(device).then(function(device) {
				vm.connecting = null;
				vm.connected = device;
			}, function() {
				vm.connecting = null;
			});
		}

		function disconnect(device) {
			vm.connecting = device;
			bluetoothService.disconnect(device).then(function() {
				vm.connecting = null;
				vm.connected = null;
			}, function() {
				vm.connecting = null;
			});
		}

		function scanForDevices() {
			bluetoothle.startScan(function(response) {
				console.log(response);
				if(response.status == "scanResult") {
					if(response.name == null) {
						response.name = "No name";
					}
					bluetoothService.checkConnection(response).then(function(device) {
						console.log(JSON.stringify(device));
						if(vm.devices.indexOf(device) == -1) {
							var contains = false;
							for(var i in vm.devices) {
								if(vm.devices[i].address == device.address) {
									contains = true;
								}
							}
							if(!contains) {
								vm.connected = device;
								vm.devices.push(device);
							}
						}
					}, function() {
						if(vm.devices.indexOf(response) == -1) {
							var contains = false;
							for(var i in vm.devices) {
								if(vm.devices[i].address == response.address) {
									contains = true;
								}
							}
							if(!contains) {
								vm.devices.push(response);
							}
						}
					});
				}
			}, function(response) {
				console.log("Error");
				console.log(JSON.stringify(response));
				bluetoothle.stopScan(scanForDevices);
			}, scanOptions);
			$timeout(function() {
				console.log("Scan stopped");
				bluetoothle.stopScan();
				vm.initializing = false;
			}, 60000);
		}
	}
})();