
class Messages
	constructor: (@$resource, @settings)->
		@url = @settings.baseurl + "/api/news/:id"
		@message = @$resource @url, {id: '@id'}

	all: ->
		@message.query()
		

angular.module('app').service 'Message', [
	'$resource',
	'settings',
	Messages
]
