
class User
	constructor: (@$resource, @$http, @settings)->
		@url = @settings.apiurl + '/users/:id'
		@User = @$resource @url, {id: '@id'}

	all: ->
		@User.query()

	save: (user)->
		@User.save(user)

	exist: (username) ->
		@$http.get @settings.baseurl + '/guest/api/userexist?username=' + username
		

angular.module('app').service 'User', ['$resource', '$http', 'settings', User]
