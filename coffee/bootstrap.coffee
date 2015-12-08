
class Bootstrap
	constructor: ($ionicPlatform, $http, settings) ->
		$ionicPlatform.ready ->
			if window.cordova and window.cordova.plugins.Keyboard
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
				cordova.plugins.Keyboard.disableScroll true
			if window.StatusBar
				StatusBar.styleDefault()

			# $http.get settings.apiurl+'/guest/angular_login'


angular.module('app').run ['$ionicPlatform', '$http', 'settings', Bootstrap]
