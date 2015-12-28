
class HealthCtrl
	constructor: (@$scope, @$stateParams) ->
		@$scope.type = @$stateParams.type
		
		@$scope.onTabSelect = (type) =>
			@$scope.type = type


angular.module('app').controller 'HealthCtrl', [
	'$scope',
	'$stateParams',
	HealthCtrl
]
