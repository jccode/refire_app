
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
		$http.defaults.headers.common['Authorization'] = 'Token ' + auth.user.token

		# events
		$rootScope.$on event.LOGIN, (event, user) =>
			console.log 'login success. broadcast.'
			console.log user
			$http.defaults.headers.common['Authorization'] = 'Token ' + user.token
		
		$rootScope.$on event.LOGOUT, (event) =>
			$http.defaults.headers.common['Authorization'] = undefined
		

angular.module('app').run ['$ionicPlatform', '$http', '$rootScope', 'Auth', 'event', Bootstrap]
