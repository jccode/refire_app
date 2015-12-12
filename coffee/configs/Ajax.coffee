
class Ajax
	constructor: ($httpProvider, $rootScope, event) ->

		# http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
		serialize = (obj) ->
			return Object.keys(obj).reduce((a,k)->
				a.push(k+'='+encodeURIComponent(obj[k]))
				return a
			,[]).join('&')
		
		$httpProvider.defaults.withCredentials = true
		$httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest"

		# post data as form
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
		$httpProvider.defaults.transformRequest = [ (data)=>
			if angular.isObject(data) and String(data) isnt '[Object File]' then serialize(data) else data
			]

		# auth
		basic_auth_header = (user) ->
			'Basic ' + $base64.encode(user.username + ':' + user.password)

		$httpProvider.defaults.headers.common['Authorization'] = basic_auth_header $rootScope.user

		$rootScope.$on event.LOGIN, (event, user) ->
			$httpProvider.defaults.headers.common['Authorization'] = basic_auth_header user
			
		$rootScope.$on event.LOGOUT, (event) ->
			$httpProvider.defaults.headers.common['Authorization'] = ''

		

angular.module('app').config ['$httpProvider', '$rootScope', 'event', Ajax]
