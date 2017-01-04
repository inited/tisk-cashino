(function() {
	"use strict";

	angular
		.module('app')
		.config(appConfig);

	appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

	function appConfig($stateProvider, $urlRouterProvider) {

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		// Each state's controller can be found in controllers.js
		$stateProvider

		// setup an abstract state for the tabs directive
			.state('tab', {
				url: '/tab',
				abstract: true,
				templateUrl: 'app/templates/tabs.html'
			})

			// Each tab has its own nav history stack:

			.state('tab.devices', {
				url: '/devices',
				views: {
					'tab-devices': {
						templateUrl: 'app/templates/tab-devices.html',
						controller: 'DevicesController',
						controllerAs: 'devices'
					}
				}
			})

			.state('tab.settings', {
				url: '/settings',
				views: {
					'tab-settings': {
						templateUrl: 'app/templates/tab-settings.html',
						controller: 'SettingsController',
						controllerAs: 'settings'
					}
				}
			})

			.state('tab.print', {
				url: '/print',
				views: {
					'tab-print': {
						templateUrl: 'app/templates/tab-print.html',
						controller: 'PrintController',
						controllerAs: 'print'
					}
				}
			});

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/devices');
	}
})();