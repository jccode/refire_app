
class NewProfileCtrl
	constructor:(@$scope, @$state, @moment)->
		console.log 'new profile ctrl'
		@userprofile = {}
		@$scope.datepickerObject =
			callback: (val)=>
				@datePickerCallback(val)

	datePickerCallback: (val)->
		# console.log '||'+val+'||'+typeof(val)+'||'+@moment(val).format('YYYY-MM-DD')
		@$scope.datepickerObject.inputDate = val
		@userprofile.birthday = @moment(val).format('YYYY-MM-DD')


angular.module('app').controller 'NewProfileCtrl', [
	'$scope',
	'$state',
	'moment',
	NewProfileCtrl
]
