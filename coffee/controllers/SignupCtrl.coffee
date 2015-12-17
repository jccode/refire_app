
class SignupCtrl
	constructor: (@$scope, @User, @auth) ->
		
		
	signup: (form)->
		if form.$valid
			console.log @user
			# @User.save @user
			# 	.$promise.then (ret)->
			# 		console.log ret
			# 	, (err) ->
			# 		console.log err
			@auth.signup @user, (user)->
				console.log 'signup success'
				console.log user
			, (err) ->
				console.log 'signup error'
			
		

angular.module('app').controller 'SignupCtrl', [
	'$scope',
	'User',
	'Auth',
	SignupCtrl
	]
