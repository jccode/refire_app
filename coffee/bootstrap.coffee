
class Bootstrap
	constructor: ($ionicPlatform, $http, $rootScope, auth, event) ->
		# device ready
		$ionicPlatform.ready ->
			if window.cordova and window.cordova.plugins.Keyboard
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
				cordova.plugins.Keyboard.disableScroll true
			if window.StatusBar
				StatusBar.styleDefault()
		
		# authentication
		$http.defaults.headers.common['Authorization'] = 'Basic ' + auth.user.auth

		# events
		$rootScope.$on event.LOGIN, (event, user) =>
			$http.defaults.headers.common['Authorization'] = 'Basic ' + user.auth
		
		$rootScope.$on event.LOGOUT, (event) =>
			$http.defaults.headers.common['Authorization'] = ''
		

angular.module('app').run ['$ionicPlatform', '$http', '$rootScope', 'Auth', 'event', Bootstrap]
