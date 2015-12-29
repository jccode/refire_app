
class SmsCtrl
	constructor: (@$scope, @$state)->
		console.log 'SmsCtrl'

	verify: ()->
		@$state.go 'app.createprofile'


angular.module('app').controller 'SmsCtrl', [
	'$scope',
	'$state',
	SmsCtrl
]
