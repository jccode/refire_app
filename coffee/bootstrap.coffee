
class Bootstrap
	constructor: ($ionicPlatform, $http, settings) ->
		$ionicPlatform.ready ->
			if window.cordova and window.cordova.plugins.Keyboard
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
				cordova.plugins.Keyboard.disableScroll true
			if window.StatusBar
				StatusBar.styleDefault()


angular.module('app').run ['$ionicPlatform', '$http', 'settings', Bootstrap]
