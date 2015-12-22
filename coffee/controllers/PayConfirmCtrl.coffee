
class PayConfirmCtrl
	constructor: (@$scope, @$state, @$stateParams, @$localStorage, @$sessionStorage, @storageKey) ->
		type = @$stateParams.type
		# console.log "#{type} , type is #{typeof type}"
		@pay_method_logo = if type is "1" then 'img/wechat.png' else 'img/alipay.png'
		@step = @$sessionStorage[@storageKey.PAY_STEP_SEQNO] + 1
		@tickets = @$localStorage[@storageKey.TICKETS] || []

	pay: ->
		# save to local storage
		@$localStorage[@storageKey.TICKETS] = @tickets.push
			line: @$sessionStorage[@storageKey.PAY_BUS_LINE]
			timestamp: moment().format 'YYYY-MM-dd hh:mm'
		@$state.go 'app.tickets'

	cancel: ->
		history.back()

angular.module('app').controller 'PayConfirmCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	'$localStorage',
	'$sessionStorage',
	'storageKey',
	PayConfirmCtrl
]
