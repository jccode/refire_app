
class Config
	constructor: ($stateProvider, $urlRouterProvider, roles, access) ->
		# console.log JSON.stringify roles
		# console.log JSON.stringify access

		$stateProvider
			.state 'app',
				url: '/app'
				abstract: true
				templateUrl: 'templates/menu.html'
				controller: 'AppCtrl'

			.state 'app.health',
				url: '/health'
				views:
					'menuContent':
						templateUrl: 'templates/health.html'
				data:
					access: access.public

			.state 'app.statistics',
				url: '/statistics'
				views:
					'menuContent':
						templateUrl: 'templates/statistics.html'
				data:
					access: access.user

			.state 'app.setting',
				url: '/setting'
				views:
					'menuContent':
						templateUrl: 'templates/setting.html'
				data:
					access: access.public

			.state 'app.profile',
				url: '/profile'
				views:
					'menuContent':
						templateUrl: 'templates/profile.html'
				data:
					access: access.user
				
			.state 'app.playlists',
				url: '/playlists'
				views:
					'menuContent':
						templateUrl: 'templates/playlists.html'
						controller: 'PlaylistsCtrl'

			.state 'app.single', 
				url: '/playlists/:playlistId'
				views:
					'menuContent':
						templateUrl: 'templates/playlist.html'
						controller: 'PlaylistCtrl'

			.state 'app.test',
				url: '/test'
				views:
					'menuContent':
						templateUrl: 'templates/test.html'
						controller: 'TestCtrl as ctrl'
				data:
					access: access.admin

			.state 'app.test-native', 
				url: '/native'
				views:
					'menuContent':
						templateUrl: 'templates/native-test.html'
						controller: 'NativeTestCtrl as ctrl'
				data:
					access: access.admin

		$urlRouterProvider.otherwise '/app/playlists'



angular.module('app').config ['$stateProvider', '$urlRouterProvider', 'userRoles', 'accessLevels', Config]
