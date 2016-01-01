
class BusOverviewCtrl
	constructor: (@$scope)->
		console.log 'Bus overview ctrl'

	doRefresh: ()->
		console.log 'do refresh'
		@$scope.$broadcast('scroll.refreshComplete');

angular.module('app').controller 'BusOverviewCtrl', [
	'$scope',
	BusOverviewCtrl
	]
