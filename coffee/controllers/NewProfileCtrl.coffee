
class NewProfileCtrl
	constructor:(@$scope, @$rootScope, @$state, @$stateParams, @$ionicHistory, @gettextCatalog, @moment, @$cordovaFile, @$cordovaImagePicker, @userProfileSvc, @util)->
		@id = @$stateParams.id
		if @id
			@userprofile = @userProfileSvc.get @id
		else
			@userprofile = {}
		@$scope.datepickerObject =
			callback: (val)=>
				@datePickerCallback(val)

	datePickerCallback: (val)->
		# console.log '||'+val+'||'+typeof(val)+'||'+@moment(val).format('YYYY-MM-DD')
		@$scope.datepickerObject.inputDate = val
		@userprofile.birthday = @moment(val).format('YYYY-MM-DD')

	skip: ()->
		@$ionicHistory.nextViewOptions
			disableBack: true
		@$state.go 'app.home.energy'

	submit: (form)->
		if form.$valid
			cuser = @$rootScope.user
			@userprofile.uid = cuser.id
			if not @id
				@userprofile.phone = cuser.username
				post_data = @userprofile
			else
				if @userprofile.avatar and @userprofile.avatar.toString() isnt "[object Blob]"
					post_data = angular.copy @userprofile
					delete post_data.avatar
				else
					post_data = @userprofile
			
			ret = @userProfileSvc.save post_data
			ret.$promise.then (ret)=>
				# console.log "save success. #{JSON.stringify(ret)} "
				@util.toast @gettextCatalog.getString 'update profile successful.'
				if not @id
					@skip()
			, (err) =>
				console.log 'save failed. #{err}'
				@util.toast @gettextCatalog.getString 'update profile failed. #{err}'

	imagepicker: ->
		options =
			maximumImagesCount: 1
			width: 105
			height: 105
			quality: 90
		@$cordovaImagePicker.getPictures options
			.then (results)=>
				console.log 'img url', JSON.stringify results
				@imgurl = results[0]
				@resolveFile results[0]
			, (err)->
				@Util.toast JSON.stringify err

	resolveFile: (url)->
		name = url.split('/').pop()
		ext = url.split('.').pop()
		if ext.toLowerCase() is "jpg"
			ext = "jpeg"
			
		# console.log "url #{url}, name: #{name} , ext: #{ext}"
		# console.log cordova.file.applicationStorageDirectory
		# console.log cordova.file.cacheDirectory
		@$cordovaFile.readAsArrayBuffer(cordova.file.cacheDirectory, name)
			.then (ret)=>
				# console.log 'read success', ret
				blob = new Blob([ret], {type: "image/"+ext, name: name})
				# console.log JSON.stringify blob
				@userprofile.avatar = blob
				
			, (err)=>
				console.log 'read file error', JSON.stringify err

	imgtest: ->
		imgs = ["img/avatar.jpg","img/wechat.png","img/ibeacon-on.png"]
		@imgurl = imgs[Math.floor(Math.random()*imgs.length)]


angular.module('app').controller 'NewProfileCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'$ionicHistory',
	'gettextCatalog',
	'moment',
	'$cordovaFile',
	'$cordovaImagePicker',
	'userProfile',
	'Util',
	NewProfileCtrl
]
