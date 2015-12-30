
class SettingCtrl
	constructor: (@$scope, @$state, @gettextCatalog, @$ionicHistory, @auth, @util)->
		console.log 'setting ctrl'

	logoff: ()->
		@auth.logout()
		@util.toast @gettextCatalog.getString 'logoff success.'
		@$ionicHistory.nextViewOptions
			disableBack: true
		@$state.go 'app.home.energy'

angular.module('app').controller 'SettingCtrl', [
	'$scope',
	'$state',
	'gettextCatalog',
	'$ionicHistory',
	'Auth',
	'Util',
	SettingCtrl
]
