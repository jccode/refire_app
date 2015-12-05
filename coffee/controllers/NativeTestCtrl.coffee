
class NativeTestCtrl
	constructor: (@$scope, @$cordovaDevice, @$cordovaToast, @$cordovaLocalNotification) ->
		@deviceInfo()
		@toast()
		@localNotification()

	deviceInfo: ->
		@$scope.retrieve_device = =>
			@$scope.device =
				device: @$cordovaDevice.getDevice()
				cordova: @$cordovaDevice.getCordova()
				model: @$cordovaDevice.getModel()
				platform: @$cordovaDevice.getPlatform()
				uuid: @$cordovaDevice.getUUID()
				version: @$cordovaDevice.getVersion()

	deviceInfo_stub: ->
		@$scope.device =
			device: 'iphone'
			cordova: 'cordova 1.6'
			model: '6S-plus'
			platform: 'iOS'
			uuid: 'xxxx-yyyy-zzzz'
			version: '6.0'

	toast: ->
		toast = (duration, position) =>
			@$cordovaToast.show("Here is a message", duration, position)
				.then (success)->
					console.log "success: "+success
				, (error)->
					console.log "error: "+error
					
		@$scope.toast_sb = -> toast "short", "bottom"
		@$scope.toast_lc = -> toast "long", "center"
		@$scope.toast_st = -> toast "short", "top"

	localNotification: ->
		@$scope.scheduleSingleNotification = =>
			@$cordovaLocalNotification.schedule
				id: 1
				title: 'Hello'
				text: 'Hello ionic'
				data:
					customProperty: 'custom value'
			.then (result)->
				console.log '[local notification]'+result

		@$scope.scheduleMultipleNotifications = =>
			@$cordovaLocalNotification.schedule [
				id: 1
				title: 'Title 1'
				text: 'text 1'
				data:
					customProperty: 'custom 1 value'
			,
				id: 2
				title: 'Title 2'
				text: 'text 2'
				data:
					customProperty: 'custom 2 value'
			]
			.then (result)->
				console.log '[local notification]'+result

		@$scope.updateSingleNotification = =>
			@$cordovaLocalNotification.update
				id: 1
				title: 'Hello - UPDATED'
				text: 'Hello ionic - UPDATED'
			.then (result)->
				console.log '[local notification]'+result

		@$scope.cancelAllNotifications = =>
			@$cordovaLocalNotification.cancelAll().then (result)->
				console.log '[local notification]'+result
		


angular.module('app').controller 'NativeTestCtrl', [
	'$scope',
	'$cordovaDevice',
	'$cordovaToast',
	'$cordovaLocalNotification', 
	NativeTestCtrl]
