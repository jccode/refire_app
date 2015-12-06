
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
		@user = get_current_user()
		
		@authorize = (role) =>
			auths = (auth[l..].toLowerCase() for auth in @user.authorities)
			role in auths

		@isLoggedIn = (user) =>
			user = user || @user
			user.username isnt ''

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


angular.module('app').factory 'Auth', ['$http', '$rootScope', '$localStorage', Auth]
