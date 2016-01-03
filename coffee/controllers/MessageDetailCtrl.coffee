
class MessageDetailCtrl
	constructor:(@$scope, @$stateParams, @Message)->
		id = @$stateParams.id
		@$scope.msg = @Message.get id

angular.module('app').controller 'MessageDetailCtrl', [
	'$scope',
	'$stateParams',
	'Message',
	MessageDetailCtrl
	]
