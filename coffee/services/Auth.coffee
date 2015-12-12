
class Auth
	constructor: ($http, $rootScope, $localStorage, $base64, settings, event) ->
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
			@user = user
			user

		role_prefix = 'ROLE_'
		l = role_prefix.length

		# object to return
		@user = get_current_user()
		
		@authorize = (role) =>
			console.log @user.authorities
			auths = (auth.authority[l..].toLowerCase() for auth in @user.authorities)
			role in auths

		@isLoggedIn = (user) =>
			user = user || @user
			user.username isnt ''

		@login_old = (user, success, error) =>
			$http
				.post(settings.baseurl+'/login', user)
				.success (user)->
					set_current_user user
					success user
				.error error

		@login = (user, success, error) =>
			headers =
				Authorization: 'Basic ' + $base64.encode(user.username + ':' + user.password)
			$http
				.post(settings.apiurl + '/user', user, {headers: headers})
				.success (user)->
					set_current_user user
					success user
					$rootScope.$broadcast event.LOGIN, user
				.error error

		@logout_old = (success, error) =>
			$http
				.post(settings.baseurl+'/logout')
				.success ->
					set_current_user anon_user
					success()
				.error error

		@logout = () =>
			set_current_user anon_user
			$rootScope.$broadcast event.LOGOUT

		return @


angular.module('app').factory 'Auth', ['$http', '$rootScope', '$localStorage', '$base64', 'settings', 'event', Auth]
