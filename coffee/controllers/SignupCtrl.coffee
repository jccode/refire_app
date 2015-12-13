
class SignupCtrl
	constructor: (@$scope, @User) ->
		
		
	signup: (form)->
		if form.$valid
			console.log @user
			@User.save @user
				.$promise.then (ret)->
					console.log ret
				, (err) ->
					console.log err
			
		

angular.module('app').controller 'SignupCtrl', [
	'$scope',
	'User',
	SignupCtrl
	]
