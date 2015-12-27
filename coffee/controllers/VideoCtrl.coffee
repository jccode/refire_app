
class VideoCtrl
	constructor: (@$scope, @$state, @$stateParams)->
		id = @$stateParams.type
		@$scope.video_src = @get_video_src id

	get_video_src: (id)->
		# "img/video/#{id}.mp4"
		"http://192.168.1.104/video/#{id}.mp4"
		

angular.module('app').controller 'VideoCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	VideoCtrl
]
