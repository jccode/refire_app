
class Util
	constructor: (@$rootScope, @$cordovaToast)->

	toast: (msg)->
		alert msg


angular.module('app').service 'Util', ['$rootScope', '$cordovaToast', Util]
