
class Sms
	constructor: (@$http, @settings)->
		@url = @settings.baseurl + "/sms/send/"
		
	send: (phone)->
		@$http.post @url, {'phone': phone}
		
angular.module('app').service 'Sms', ['$http', 'settings', Sms]
