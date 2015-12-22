
class PayCtrl
	constructor: (@$scope, @$localStorage, @$sessionStorage, @storageKey) ->
		@$scope.ibeacon_detected = false
		@$scope.step = if @$scope.ibeacon_detected then 1 else 2
		# @$localStorage[@storageKey.PAY_STEP_SEQNO] = @$scope.step

		defaultVal = {}
		defaultVal[@storageKey.PAY_BUS_LINE] = 'M474'
		# defaultVal[@storageKey.PAY_STEP_SEQNO] = @$scope.step
		
		@storage = @$sessionStorage.$default defaultVal
		@storage[@storageKey.PAY_STEP_SEQNO] = @$scope.step
		

angular.module('app').controller 'PayCtrl', [
	'$scope',
	'$localStorage',
	'$sessionStorage',
	'storageKey',
	PayCtrl
]
