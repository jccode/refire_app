
class Messages
	constructor: (@$resource, @settings)->
		@url = @settings.baseurl + "/api/news/:id/"
		@message = @$resource @url, {id: '@id'}

	all: ->
		@message.query()

	get: (id)->
		@message.get
			id: id

angular.module('app').service 'Message', [
	'$resource',
	'settings',
	Messages
]
