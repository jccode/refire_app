
class TestCtrl
	constructor: (@$scope, @$ionicPopover, @$ionicHistory, @$state, @$rootScope, @user) ->
		@initPopover()
		@$scope.get_users = =>
			@$scope.users = @user.all()

	initPopover: ->
		@$scope.popover = @$ionicPopover.fromTemplateUrl('templates/action_more.html', {
			scope: @$scope
		}).then (popover)=>
			@$scope.popover = popover

		@$scope.openPopover = ($event)=>
			@$scope.popover.show $event

		@$scope.closePopover = =>
			@$scope.popover.hide()

		@$scope.$on '$destroy', ()=>
			@$scope.popover.remove()

		@$scope.actionMore = =>
			@$ionicHistory.nextViewOptions
				disableBack: true
			@$scope.closePopover()
			@$state.go 'app.setting'

		@$scope.about = =>
			@$scope.closePopover()
			@$state.go 'app.test-native'


angular.module('app').controller 'TestCtrl', [
	'$scope',
	'$ionicPopover',
	'$ionicHistory',
	'$state',
	'$rootScope',
	'User',
	TestCtrl]
