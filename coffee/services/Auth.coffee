
class Auth
	constructor: ($http, $rootScope, $localStorage) ->
		anon_user =
			username: ''
			authorities: []
			
		$storage = $localStorage.$default
			user: anon_user

		get_current_user = ->
			if not $rootScope.user
				$rootScope.user = $storage.user
			$rootScope.user

		set_current_user = (user)->
			$storage.user = user
			$rootScope.user = user
			user

		role_prefix = 'ROLE_'
		l = role_prefix.length

		# object to return
		@user = get_current_user
		
		@authorize = (role) =>
			console.log @user().authorities
			auths = (auth.authority[l..].toLowerCase() for auth in @user().authorities)
			role in auths

		@isLoggedIn = (user) =>
			user = user || @user()
			user.username isnt ''

		@login = (user, success, error) =>
			server_url='http://192.168.1.103:8080'
			# headers = 
			# 	'Content-Type': 'application/x-www-form-urlencoded'
			$http
				.post(server_url+'/login', user)
				.success (user)->
					set_current_user user
					success user
				.error error

		@logout = (success, error) =>
			server_url='http://localhost:8080'
			$http
				.post(server_url+'/logout')
				.success ->
					set_current_user anon_user
					success()
				.error error

		return @


angular.module('app').factory 'Auth', ['$http', '$rootScope', '$localStorage', Auth]
