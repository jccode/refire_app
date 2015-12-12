
class NativeTestCtrl
	constructor: (@$scope, @settings, @$ionicPopup, @Util, @$cordovaDevice, @$cordovaToast, @$cordovaLocalNotification, @$cordovaImagePicker, @$cordovaFileTransfer) ->
		@deviceInfo()
		@toast()
		@localNotification()
		@imagePicker()

	imagePicker: ->
		@$scope.imgloaded = false
		options =
			maximumImagesCount: 1
			width: 800
			height: 800
			quality: 90
		@$scope.get_pictures = =>
			@$cordovaImagePicker.getPictures options
				.then (results)=>
					console.log 'img url:', JSON.stringify results
					@$scope.imgurl = results[0]
					@$scope.imgloaded = true
				, (error)->
					@$ionicPopup.alert JSON.stringify error
		@$scope.upload_img = =>
			path = @$scope.imgurl
			name = path.substring(path.lastIndexOf('/')+1)
			upload_options =
				fileKey: 'file'
				fileName: name
				params:
					name: name
			@$cordovaFileTransfer.upload @settings.apiurl+'/upload', path, upload_options
				.then (result)->
					console.log 'upload success! ', JSON.stringify result
					@Util.toast 'upload success! ' + JSON.stringify result
				, (err) ->
					console.log 'upload failed! ', JSON.stringify err
					@Util.toast 'upload failed! ' + JSON.stringify result

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
	'settings',
	'$ionicPopup',
	'Util', 
	'$cordovaDevice',
	'$cordovaToast',
	'$cordovaLocalNotification',
	'$cordovaImagePicker',
	'$cordovaFileTransfer',
	NativeTestCtrl]
