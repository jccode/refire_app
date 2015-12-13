
class GreaterThan
	constructor: ()->
		link = (scope, element, attributes, ngModel) ->
			ngModel.$validators.greaterThan = (value) ->
				parseInt(value) >= parseInt(scope.greaterThanNumber)
			scope.$watch "greaterThanNumber", ()->
				ngModel.$validate()

		return {
			restrict: 'A'
			require: 'ngModel'
			scope:
				greaterThanNumber: '=greaterThan'
			link: link
		}


angular.module('app').directive 'greateThan', GreaterThan

