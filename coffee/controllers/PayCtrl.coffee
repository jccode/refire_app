
class PayCtrl
	constructor: (@$scope, @$state, @$localStorage, @$sessionStorage, @storageKey) ->
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
		

angular.module('app').controller 'PayCtrl', [
	'$scope',
	'$state',
	'$localStorage',
	'$sessionStorage',
	'storageKey',
	PayCtrl
]
