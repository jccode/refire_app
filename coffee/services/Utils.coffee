
class Util
	constructor: (@$rootScope, @$window, @$ionicPopup, @$cordovaToast)->

	toast: (msg, fn)->
		if @$window.cordova
			@$cordovaToast.show msg, 'short', 'bottom'
				.then (success)->
					fn and fn 'ok'
				, (error) ->
					fn and fn error
		else
			@$ionicPopup.alert
				template: msg
			.then (res)->
				fn and fn res


angular.module('app').service 'Util', ['$rootScope', '$window', '$ionicPopup', '$cordovaToast', Util]
