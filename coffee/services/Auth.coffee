
class Auth
	constructor: ($http, $rootScope, $localStorage, roles) ->
		anon_user =
			username: ''
			authorities: [roles.public]
			
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


		# object to return
		# 
		@userRoles = roles
		
		@user = get_current_user()
		
		@authorize = (access) =>
			false

		@isLoggedIn = (user) =>
			false

		@login = (user, success, error) =>
			$http
				.post('/login', user)
				.success (user)->
					set_current_user user
					success user
				.error error

		@logout = (success, error) =>
			$http
				.post('/logout')
				.success ->
					set_current_user anon_user
					success()
				.error error

		return @


angular.module('app').factory 'Auth', ['$http', '$rootScope', '$localStorage', 'userRoles', Auth]
