
class AppCtrl
	constructor: (@$scope, @$rootScope, @$state, @$ionicModal, @$ionicPopup, @$timeout, @auth, @$ionicHistory, @Util) ->
		@loginModal()
		@permissionCheck()
		
		@$scope.loginData = {}

		self = @
		@$scope.doLogin = ()=>
			# console.log 'Doing login', JSON.stringify @$scope.loginData
			@auth.login @$scope.loginData, (user)=>
				# console.log 'login success.', JSON.stringify user
				@$ionicHistory.nextViewOptions
					disableBack: true
				if @forward
					@$state.go @forward.name
				@$scope.closeLogin()
				@Util.toast 'login success'
			, (e)->
				@Util.toast 'login failed.'+JSON.stringify e
				# console.log 'login failed', JSON.stringify e


		# @$scope.logout_old = ()=>
		# 	@auth.logout ()=>
		# 		@Util.toast 'logout successful'
		# 		console.log 'logout successful'
		# 		@$ionicHistory.nextViewOptions
		# 			disableBack: true
		# 		@$state.go 'app.playlists'
		# 	, (e)=>
		# 		@Util.toast 'logout failed. '+ JSON.stringify e
		# 		console.log 'logout failed. '+ JSON.stringify e

		@$scope.logout = =>
			@auth.logout()
			@Util.toast 'logout successful'
			# console.log 'logout successful'
			@$ionicHistory.nextViewOptions
				disableBack: true
			@$state.go 'app.playlists'


	loginModal: ->
		@$ionicModal.fromTemplateUrl('templates/login.html',
			scope: @$scope
		).then (modal)=>
			@modal = modal

		@$scope.closeLogin = =>
			@modal.hide()

		@$scope.login = =>
			@modal.show()

	permissionCheck: ->
		@$scope.$on "$stateChangePermissionDenied", (toState, toParams)=>
			if not @auth.isLoggedIn()
				# console.log toState
				# console.log toParams
				@forward = toParams
				@$scope.login()
			else
				@$ionicPopup.alert
					title: 'Permission denied'
					template: 'You don\'t have permission to view this page.'

		@$scope.$on "error:401", (response)=>
			# console.log '401'+response
			@forward = null
			@$scope.login()


angular.module('app').controller 'AppCtrl', [
	'$scope',
	'$rootScope',
	'$state', 
	'$ionicModal',
	'$ionicPopup',
	'$timeout',
	'Auth',
	'$ionicHistory',
	'Util',
	AppCtrl]
