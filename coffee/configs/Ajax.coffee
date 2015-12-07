
class Ajax
	constructor: ($httpProvider) ->
		$httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest"


angular.module('app').config ['$httpProvider', Ajax]
