
class SettingCtrl
	constructor: (@$scope, @$rootScope, @$state, @gettextCatalog, @$ionicHistory, @$localStorage, @auth, @userProfile, @util, @roles, @storageKey)->
		@user = @$rootScope.user
		@isdriver = @auth.authorize @roles.driver
		@profile = @userProfile.get @user.id

		sec = @gettextCatalog.getString "second"
		@refresh_rate = "0"
		@refresh_options = [
			{value: "0", label: @gettextCatalog.getString("Manual")},
			{value: "30", label: "30 "+sec},
			{value: "60", label: "60 "+sec},
			{value: "90", label: "90 "+sec}
		]

		default_setting = {}
		default_setting[@storageKey.SETTING_REFRESH_RATE] = @refresh_rate
		@storage = @$localStorage.$default default_setting

	logoff: ()->
		@auth.logout()
		@util.toast @gettextCatalog.getString 'logoff success.'
		@$ionicHistory.nextViewOptions
			disableBack: true
		@$state.go 'app.home.energy'

	update_refresh_rate: ()->
		@storage[@storageKey.SETTING_REFRESH_RATE] = @refresh_rate


angular.module('app').controller 'SettingCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'gettextCatalog',
	'$ionicHistory',
	'$localStorage',
	'Auth',
	'userProfile',
	'Util',
	'userRoles',
	'storageKey',
	SettingCtrl
]
