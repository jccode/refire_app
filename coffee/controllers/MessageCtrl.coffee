
class MessageCtrl
	constructor: (@$scope, @Message)->
		@$scope.messages = @Message.all()


angular.module('app').controller 'MessageCtrl', [
	'$scope',
	'Message',
	MessageCtrl
]
