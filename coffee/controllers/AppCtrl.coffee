
class AppCtrl
	constructor: (@$scope, @$rootScope, @$state, @$ionicModal, @$ionicPopup, @$timeout, @auth, @$ionicHistory, @gettext, @gettextCatalog, @Util) ->
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
				@Util.toast @gettextCatalog.getString 'login success'
			, (e)=>
				# @Util.toast @gettext('login failed')+"."+JSON.stringify e
				#@Util.toast "#{@gettextCatalog.getString('login failed')}.#{JSON.stringify e}"
				console.log 'login failed', JSON.stringify e
				@Util.toast @gettextCatalog.getString("Login failed. Incorrect username or password.")


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
			@Util.toast "#{@gettextCatalog.getString 'logout successful'}"
			# console.log 'logout successful'
			@$ionicHistory.nextViewOptions
				disableBack: true
			@$state.go 'app.playlists'

		@$scope.signup = =>
			@$scope.closeLogin()
			@$ionicHistory.nextViewOptions
				disableBack: true
			@$state.go 'app.signup'

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
					title: @gettextCatalog.getString 'Permission denied'
					template: @gettextCatalog.getString('You don\'t have permission to view this page.')

		loginRequireHandler = (response) =>
			@forward = null
			@$scope.login()
			
		@$scope.$on "error:403", loginRequireHandler
		@$scope.$on "error:401", loginRequireHandler


angular.module('app').controller 'AppCtrl', [
	'$scope',
	'$rootScope',
	'$state', 
	'$ionicModal',
	'$ionicPopup',
	'$timeout',
	'Auth',
	'$ionicHistory',
	'gettext',
	'gettextCatalog',
	'Util',
	AppCtrl]
