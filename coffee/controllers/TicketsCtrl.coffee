
class TicketsCtrl
	constructor: (@$scope) ->
		@$scope.tickets = [
			line: 'Bus M474'
			timestamp: '2015-12-22 13:15'
		,
			line: 'Bus 299'
			timestamp: '2015-12-24 14:20'
		]
		

angular.module('app').controller 'TicketsCtrl', ['$scope', TicketsCtrl]
