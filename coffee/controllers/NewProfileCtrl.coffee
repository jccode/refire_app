
class NewProfileCtrl
	constructor:(@$scope, @$state)->
		console.log 'new profile ctrl'


angular.module('app').controller 'NewProfileCtrl', [
	'$scope',
	'$state',
	NewProfileCtrl
]
