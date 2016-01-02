
class BusOverviewCtrl
	constructor: (@$scope, @$rootScope, @BusData)->
		console.log 'Bus overview ctrl'
		@bus = @$rootScope.bus
		console.log @bus
		if @bus and @bus.bid
			@getdata()

	getdata: ()->
		@BusData.busdata @bus.bid
			.then (ret)=>
				@data = ret.data

	doRefresh: ()->
		@getdata()
		@$scope.$broadcast('scroll.refreshComplete');

angular.module('app').controller 'BusOverviewCtrl', [
	'$scope',
	'$rootScope',
	'BusData',
	BusOverviewCtrl
	]
