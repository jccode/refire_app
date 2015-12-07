
class Bootstrap
	constructor: ($ionicPlatform, $http) ->
		$ionicPlatform.ready ->
			if window.cordova and window.cordova.plugins.Keyboard
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
				cordova.plugins.Keyboard.disableScroll true
			if window.StatusBar
				StatusBar.styleDefault()

			$http.get('http://localhost:8080/')


angular.module('app').run ['$ionicPlatform', '$http', Bootstrap]
