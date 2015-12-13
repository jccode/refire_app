
class CompareTo
	constructor: ()->
		link = (scope, element, attributes, ngModel) ->
			ngModel.$validators.compareTo = (modelValue) ->
				modelValue is scope.otherValue.$modelValue
			scope.$watch "otherValue", ()->
				ngModel.$validate()
		
		return {
			require: 'ngModel'
			scope:
				otherValue: "=compareTo"
			link: link
		}


angular.module('app').directive 'compareTo', CompareTo
