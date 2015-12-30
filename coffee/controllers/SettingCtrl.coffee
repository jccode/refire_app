
class SettingCtrl
	constructor: (@$scope, @$rootScope, @$state, @gettextCatalog, @$ionicHistory, @auth, @userProfile, @util, @roles)->
		@user = @$rootScope.user
		@isdriver = @auth.authorize @roles.driver
		@profile = @userProfile.get @user.id

	logoff: ()->
		@auth.logout()
		@util.toast @gettextCatalog.getString 'logoff success.'
		@$ionicHistory.nextViewOptions
			disableBack: true
		@$state.go 'app.home.energy'

angular.module('app').controller 'SettingCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'gettextCatalog',
	'$ionicHistory',
	'Auth',
	'userProfile',
	'Util',
	'userRoles',
	SettingCtrl
]
