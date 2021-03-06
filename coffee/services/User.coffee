
class User
	constructor: (@$resource, @$http, @settings)->
		@url = @settings.baseurl + '/api/user/:id'
		@User = @$resource @url, {id: '@id'}

	all: ->
		@User.query()

	save: (user)->
		@User.save(user)

	exist: (username) ->
		@$http.get @settings.baseurl + '/userprofile/userexist/?q=' + username
		

angular.module('app').service 'User', ['$resource', '$http', 'settings', User]
