
class PayCtrl
	constructor: (@$rootScope, @$scope, @$state, @$localStorage, @$sessionStorage, @storageKey, @event) ->
		@$scope.ibeacon_detected = false
		@$scope.step = if @$scope.ibeacon_detected then 1 else 2

		@busline = 'M474'
		defaultVal = {}
		defaultVal[@storageKey.PAY_BUS_LINE] = @busline
		
		@storage = @$sessionStorage.$default defaultVal
		@storage[@storageKey.PAY_STEP_SEQNO] = @$scope.step

		@$scope.pay_confirm = (state) =>
			@storage[@storageKey.PAY_BUS_LINE] = @busline
			@$state.go 'app.pay-confirm', {type: state}

		# ibeacon
		
		@$scope.ibeacon_detected = if @$rootScope.bus then true else false
		@$rootScope.$on @event.ENTER_BUS, (bus)=>
			@$scope.ibeacon_detected = true
		@$rootScope.$on @event.LEAVE_BUS, (bus)=>
			@$scope.ibeacon_detected = false
		

angular.module('app').controller 'PayCtrl', [
	'$rootScope',
	'$scope',
	'$state',
	'$localStorage',
	'$sessionStorage',
	'storageKey',
	'event',
	PayCtrl
]
