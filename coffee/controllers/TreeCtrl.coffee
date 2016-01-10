
class TreeCtrl
	constructor: (@$scope, @$rootScope, @BusData, @auth)->
		@bus = @$rootScope.bus
		@BASE = 100				# base number
		if @bus and @bus.bid and @auth.isLoggedIn()
			@getdata()

	getdata: ()->
		@BusData.busdata @bus.bid
			.then (ret)=>
				@data = ret.data
				emission_reduction = @data.EnergySavingData.emission_reduction
				@calc emission_reduction

	calc:(emission_reduction)->
		#console.log "reduction: #{emission_reduction}, base: #{@BASE}"
		@$scope.tree = Math.floor(emission_reduction / @BASE)
		@$scope.percentage = emission_reduction % @BASE
		@set_percentage (@$scope.percentage / @BASE)

	set_percentage: (p)->
		tree_h = document.getElementById("tree").offsetHeight
		document.getElementById("bg").style.height = (tree_h * p) + "px"
		

angular.module('app').controller 'TreeCtrl', [
	'$scope',
	'$rootScope',
	'BusData',
	'Auth',
	TreeCtrl
]
