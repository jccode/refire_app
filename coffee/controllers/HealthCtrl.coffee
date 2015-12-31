
class HealthCtrl
	constructor: (@$scope, @$stateParams, @gettextCatalog) ->
		@$scope.type = @$stateParams.type
		# @init_chart()
		@init_1m()

		@$scope.total_distance = '400 KM'
		@$scope.total_energy_saving = '300 KMK'
		@$scope.total_emission_reduction = '200 KWH'
		@$scope.onTabSelect = (type) =>
			@$scope.type = type
			switch type
				when 1 then @init_1m()
				when 2 then @init_3m()
				when 3 then @init_6m()
				else init_period()

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

	init_1m: ->
		@$scope.head = @gettextCatalog.getString 'December'
		@$scope.labels = [1..30]
		@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]		

	init_3m: ->
		@$scope.head = '10 ~ 12'
		@$scope.labels = [10,11,12]
		@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]

	init_6m: ->
		@$scope.head = '7 ~ 12'
		@$scope.labels = [7..12]
		@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]

	init_period: ->
		@init_6m()

angular.module('app').controller 'HealthCtrl', [
	'$scope',
	'$stateParams',
	'gettextCatalog',
	HealthCtrl
]
