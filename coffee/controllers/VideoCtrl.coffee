
class VideoCtrl
	constructor: (@$scope, @$state, @$stateParams)->
		id = @$stateParams.type
		@$scope.video_src = @get_video_src id

	get_video_src: (id)->
		# "img/video/#{id}.mp4"
		return switch id
			when "1" then "img/video/energyflow_sd_high.mp4"
			when "2" then "img/video/fuelcell_sd_high.mp4"
		

angular.module('app').controller 'VideoCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	VideoCtrl
]
