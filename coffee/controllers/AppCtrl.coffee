
class AppCtrl
	constructor: (@$scope, @$rootScope, @$state, @$ionicModal, @$ionicPopup, @$timeout, @auth, @util) ->
		@loginModal()
		@permissionCheck()
		
		@$scope.loginData = {}

		@$scope.doLogin = =>
			console.log 'Doing login', @$scope.loginData

			# @$rootScope.isLoggedIn = true
			# @$rootScope.roles = ['user', 'admin']
			# goto next state
			@$state.go @forward
			@$timeout =>
				@$scope.closeLogin()
			, 1000

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
				@forward = toParams.name
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
	'Util',
	AppCtrl]
