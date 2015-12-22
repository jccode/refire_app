
class TicketsCtrl
	constructor: (@$scope, @$localStorage, @storageKey) ->
		@$scope.tickets = @$localStorage[@storageKey.TICKETS]
		

angular.module('app').controller 'TicketsCtrl', [
	'$scope',
	'$localStorage',
	'storageKey'
	TicketsCtrl
]
