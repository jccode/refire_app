
class CsrfInterceptor
	constructor: ($cookies)->
		headerName = 'X-XSRF-TOKEN'
		cookieName = 'XSRF-TOKEN'
		allowMethods = ['GET']
		
		return {
			'request': (request)->
				if request.method not in allowMethods
					request.headers[headerName] = $cookies.get cookieName
				return request
		}


class Config
	constructor: ($httpProvider)->
		$httpProvider.interceptors.push ['$cookies', CsrfInterceptor]


# angular.module('app').config ['$httpProvider', Config]
