
class SignupCtrl
	constructor: (@$scope, @$state, @$sessionStorage, @User, @auth, @storageKey) ->
		
		
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
				console.log err

	verify: (form)->
		if form.$valid
			console.log @user
			@$sessionStorage[@storageKey.SIGNUP_USER] = @user
			@$state.go 'app.smsverify'
		

angular.module('app').controller 'SignupCtrl', [
	'$scope',
	'$state',
	'$sessionStorage',
	'User',
	'Auth',
	'storageKey',
	SignupCtrl
]
