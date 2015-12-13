
class User
	constructor: (@$resource, @settings)->
		@url = @settings.apiurl + '/users/:id'
		@User = @$resource @url, {id: '@id'}

	all: ->
		@User.query()


angular.module('app').service 'User', ['$resource', 'settings', User]
