(function() {
  "use strict";

      angular.module('app', ['ionic'])

          .run(function($ionicPlatform, $rootScope) {
              $ionicPlatform.ready(function() {
                  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                  // for form inputs)
                  if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                      cordova.plugins.Keyboard.disableScroll(true);

                  }
                  if (window.StatusBar) {
                      // org.apache.cordova.statusbar required
                      StatusBar.styleDefault();
                  }

                  var btOptions = {
                      request:	true,
					  statusReceiver: true,
					  restoreKey: "czinitedtisk"
                  };

                  bluetoothle.initialize(function(result) {
					console.log(JSON.stringify(result));
					if(result.status == "disabled") {
						bluetoothle.enable(function() {
							$rootScope.$broadcast("bluetoothinitialized");
						}, function() {
							$rootScope.$broadcast("bluetoothdisabled");
						});
					} else {
						$rootScope.$broadcast("bluetoothinitialized");
					}
                  });
              });
          });
})();