
class TestCtrl
	constructor: (@$scope, @$ionicPopover, @$ionicHistory, @$state, @$rootScope, @user, @Beacons, @sms, @$localStorage, @BeaconCheckin) ->
		@initPopover()
		@$scope.get_users = =>
			@$scope.users = @user.all()
		@$scope.get_beacons = =>
			@$scope.beacons = @Beacons.all()
		@$scope.set_bus = =>
			@$scope.beacons.$promise.then (bs)=>
				beacon = _.find bs, (b)->b.id is 2
				bus = beacon.stick_on[0]
				console.log bus
				@$rootScope.bus = bus
				@$localStorage.bus = bus
		@$scope.beacon_onbus = =>
			@BeaconCheckin.checkin("9527", 0).then (ret)->
				console.log ret
		@$scope.beacon_offbus = =>
			@BeaconCheckin.checkin("9527", 1)
				
		@initSms()
		
	initSms: ->
		@$scope.wating_sms = false
		@$scope.send_sms = (phone)=>
			unless @$scope.wating_sms
				console.log phone
				@$scope.wating_sms = true
				@sms.send phone
					.then (ret)=>
						console.log ret
					, (err)=>
						console.log err
						@$scope.wating_sms = false
							

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
	'Beacons',
	'Sms',
	'$localStorage',
	'BeaconCheckin',
	TestCtrl]
