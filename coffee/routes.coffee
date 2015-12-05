
class Config
	constructor: ($stateProvider, $urlRouterProvider) ->
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

			.state 'app.statistics',
				url: '/statistics'
				views:
					'menuContent':
						templateUrl: 'templates/statistics.html'

			.state 'app.setting',
				url: '/setting'
				views:
					'menuContent':
						templateUrl: 'templates/setting.html'

			.state 'app.profile',
				url: '/profile'
				views:
					'menuContent':
						templateUrl: 'templates/profile.html'
				
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

			.state 'app.test-native', 
				url: '/native'
				views:
					'menuContent':
						templateUrl: 'templates/native-test.html'
						controller: 'NativeTestCtrl as ctrl'

		$urlRouterProvider.otherwise '/app/test'


angular.module('app').config ['$stateProvider', '$urlRouterProvider', Config]
