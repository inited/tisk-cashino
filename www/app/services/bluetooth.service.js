(function() {
	"use strict";

	angular
		.module('app')
		.factory('bluetoothService', service);

	service.$inject = ['$rootScope', '$q'];

	function service($rootScope, $q) {

		var connectedDevice = null;

		function getConnectedDevice() {
			return connectedDevice;
		}

		function setConnectedDevice(device) {
			connectedDevice = device;
		}

		function connect(device) {
			var deferred = $q.defer();
			console.log("Connecting " + device.name);
			if(connectedDevice != null) {
				disconnect(connectedDevice).then(function() {
					connect(device).then(deferred.resolve, deferred.reject);
				}, deferred.reject);
			} else {
				bluetoothle.connect(function (response) {
					if (response.status == "connected") {
						$rootScope.$apply(function () {
							device.name = response.name;
							deferred.resolve(device);
							setConnectedDevice(device);
						});
					} else {
						deferred.reject();
					}
				}, function (response) {
					console.log("Error");
					console.log(JSON.stringify(response));
					deferred.reject();
				}, {
					address: device.address
				});
			}

			return deferred.promise;
		}

		function discover(address) {
			var deferred = $q.defer();
			console.log("Discovering");
			console.log(address);
			bluetoothle.discover(function(response) {
				console.log(response);
				if(response.status == "discovered") {
					deferred.resolve(response);
				} else {
					deferred.reject(response);
				}
			}, function(response) {
				console.log("Error");
				console.log(response);
				deferred.reject(response);
			}, {
				address: address,
				clearCache: true
			});

			return deferred.promise;
		}

		function disconnect(device) {
			var deferred = $q.defer();
			bluetoothle.close(function(response) {
				console.log(JSON.stringify(response));
				if (response.status == "closed") {
					$rootScope.$apply(function() {
						setConnectedDevice(null);
						deferred.resolve();
					});
				}
			}, function(response) {
				console.log("Error disconnecting");
				console.log(JSON.stringify(response));
				deferred.reject();
			}, {
				address: device.address
			});

			return deferred.promise;
		}

		function checkConnection(device) {
			var deferred = $q.defer();
			bluetoothle.isConnected(function(response) {
				console.log(JSON.stringify(response));
				if(response.isConnected == true) {
					setConnectedDevice(device);
					deferred.resolve(device);
					$rootScope.$apply();
				} else {
					deferred.reject();
					$rootScope.$apply();
				}
			}, deferred.reject, {
				address:device.address
			});

			return deferred.promise;
		}

		return {
			setConnectedDevice: setConnectedDevice,
			getConnectedDevice: getConnectedDevice,
			connect: connect,
			disconnect: disconnect,
			discover: discover,
			checkConnection: checkConnection
		}
	}
})();