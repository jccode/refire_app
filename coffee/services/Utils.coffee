
class Util
	constructor: (@$rootScope, @$window, @$ionicPopup, @$cordovaToast)->

	toast: (msg, fn)->
		if @$window.cordova
			@$cordovaToast.show msg, 'short', 'bottom'
				.then (success)->
					fn 'ok'
				, (error) ->
					fn error
		else
			@$ionicPopup.alert
				template: msg
			.then (res)->
				fn res


angular.module('app').service 'Util', ['$rootScope', '$window', '$ionicPopup', '$cordovaToast', Util]
