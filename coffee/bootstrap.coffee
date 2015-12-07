
class Bootstrap
	constructor: ($ionicPlatform, $http) ->
		$ionicPlatform.ready ->
			if window.cordova and window.cordova.plugins.Keyboard
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
				cordova.plugins.Keyboard.disableScroll true
			if window.StatusBar
				StatusBar.styleDefault()

			$http.get('http://192.168.1.103:8080/guest/angular_login')


angular.module('app').run ['$ionicPlatform', '$http', Bootstrap]
