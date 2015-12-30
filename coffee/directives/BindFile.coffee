
class BindFile
	constructor: ()->
		link = (scope, el, attrs, ngModel)->
			el.bind 'change', (event)->
				ngModel.$setViewValue event.target.files[0]
				scope.$apply()

			scope.$watch ()->
				ngModel.$viewValue
			, (value)->
				if not value
					el.val ""

		return {
			require: 'ngModel'
			restrict: 'A'
			link: link
		}


angular.module('app').directive 'bindFile', BindFile
