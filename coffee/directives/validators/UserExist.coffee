
class UserExist
	constructor: ($q, User)->
		link = (scope, element, attributes, ngModel) ->
			ngModel.$asyncValidators.userExist = (value) ->
				deferred = $q.defer()
				
				User.exist(value).then (result)->
					if result.data
						deferred.reject()
					else
						deferred.resolve()
				, (err) ->
					deferred.reject()

				deferred.promise

		return {
			restrict: 'A'
			require: 'ngModel'
			link: link
		}


angular.module('app').directive 'userExist', ['$q', 'User', UserExist]
