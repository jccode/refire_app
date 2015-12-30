
class UserProfile
	constructor: (@$resource, @settings)->
		@url = @settings.baseurl + '/api/userprofile/:id/'
		@userProfile = @$resource @url, {id: '@uid'},
			update:
				method: 'PUT'
				headers: {'Content-Type': undefined}

	save: (user)->
		fd = @formdata(user)
		@userProfile.update(fd)

	formdata: (data)->
		fd = new FormData()
		
		addFormData = (key, value)->
			if Object.prototype.toString.apply(value) is "[object Blob]"
				ext = value.type.split("/").pop()
				fd.append key, value, "avatar."+ext
			else
				fd.append key, value
				
		addFormData key, value for key, value of data
		fd['uid'] = data['uid']
		fd
		


angular.module('app').service 'userProfile', ['$resource', 'settings', UserProfile]
