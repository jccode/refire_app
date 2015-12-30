
class NewProfileCtrl
	constructor:(@$scope, @$rootScope, @$state, @$ionicHistory, @gettextCatalog, @moment, @$cordovaFile, @$cordovaImagePicker, @userProfileSvc, @util)->
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
			# console.log @userprofile
			# console.log cuser
			
			@userprofile.uid = cuser.id
			@userprofile.phone = cuser.username
			
			ret = @userProfileSvc.save @userprofile
			ret.$promise.then (ret)=>
				# console.log "save success. #{JSON.stringify(ret)} "
				@util.toast @gettextCatalog.getString 'update profile successful.'
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
	'$ionicHistory',
	'gettextCatalog',
	'moment',
	'$cordovaFile',
	'$cordovaImagePicker',
	'userProfile',
	'Util',
	NewProfileCtrl
]
