
class HealthCtrl
	constructor: (@$scope, @$stateParams) ->
		@$scope.type = @$stateParams.type
		@init_chart()
		
		@$scope.onTabSelect = (type) =>
			@$scope.type = type

	init_chart: ->
		# @$scope.labels = ["January", "February", "March", "April", "May", "June", "July"]
		# @$scope.series = ['Series A', 'Series B']
		# @$scope.data = [
		# 	[65, 59, 80, 81, 56, 55, 40],
		# 	[28, 48, 40, 19, 86, 27, 90]
		# ]
		@$scope.labels = [1..30]
		@$scope.series = ['Series A']
		@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]
		console.log @$scope.labels
		console.log @$scope.data
		@$scope.onClick = (points, evt) ->
			console.log(points, evt)
		


angular.module('app').controller 'HealthCtrl', [
	'$scope',
	'$stateParams',
	HealthCtrl
]
