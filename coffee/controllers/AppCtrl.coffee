
class AppCtrl
	constructor: (@$scope, @$rootScope, @$state, @$ionicModal, @$ionicPopup, @$timeout, @auth, @$ionicHistory) ->
		@loginModal()
		@permissionCheck()
		
		@$scope.loginData = {}

		self = @
		@$scope.doLogin = ()=>
			console.log 'Doing login', @$scope.loginData

			# @$rootScope.isLoggedIn = true
			# @$rootScope.roles = ['user', 'admin']
			# goto next state
			@auth.login @$scope.loginData, (user)=>
				console.log 'login success.', JSON.stringify user
				# console.log 'goto '+self.forward
				#
				@$ionicHistory.nextViewOptions
					disableBack: true
				@$state.go @forward.name
				console.log self.forward.name
				# self.forward.data.permissions.redirectTo = self.forward.name
				@$scope.closeLogin()
				# self.$state.go self.forward.name, {}, {location:'replace',notify:false}
			, (e)->
				console.log 'login failed'
				console.log e
			
			# @$state.go @forward
			# @$timeout =>
			# 	@$scope.closeLogin()
			# , 1000

		@$scope.logout = ->
			console.log 'Logout'


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
				console.log toState
				console.log toParams
				@forward = toParams
				@$scope.login()
			else
				@$ionicPopup.alert
					title: 'Permission denied'
					template: 'You don\'t have permission to view this page.'


angular.module('app').controller 'AppCtrl', [
	'$scope',
	'$rootScope',
	'$state', 
	'$ionicModal',
	'$ionicPopup',
	'$timeout',
	'Auth',
	'$ionicHistory',
	AppCtrl]
