
class Config
	constructor: ($stateProvider, $urlRouterProvider, roles) ->
		# console.log JSON.stringify roles
		# console.log JSON.stringify access

		$stateProvider
			.state 'app',
				url: '/app'
				abstract: true
				templateUrl: 'templates/menu.html'
				controller: 'AppCtrl'

			.state 'app.home',
				url: '/home'
				views:
					'menuContent':
						templateUrl: 'templates/home.html'
						controller: 'HomeCtrl'

			.state 'app.home.energy',
				url: '/energy'
				templateUrl: 'templates/home/energy2.html'
				controller: 'EnergyFlowCtrl as ctrl'

			.state 'app.home.video',
				url: '/video/:type'
				templateUrl: 'templates/home/video.html'
				controller: 'VideoCtrl'

			.state 'app.home.tree',
				url: '/tree'
				templateUrl: 'templates/home/tree.html'
				controller: 'TreeCtrl as ctrl'

			.state 'app.buslocation',
				url: '/buslocation'
				views:
					'menuContent':
						templateUrl: 'templates/bus_location.html'
						controller: 'BuslocationCtrl as ctrl'
						
			.state 'app.busoverview',
				url: '/busoverview'
				views:
					'menuContent':
						templateUrl: 'templates/bus_overview.html'
						controller: 'BusOverviewCtrl as ctrl'

			.state 'app.health',
				url: '/health/:type'
				views:
					'menuContent':
						templateUrl: 'templates/health.html'
						controller: 'HealthCtrl'

			.state 'app.pay',
				url: '/pay'
				views:
					'menuContent':
						templateUrl: 'templates/pay.html'
						controller: 'PayCtrl as ctrl'
				data:
					permissions:
						only: [roles.user]

			.state 'app.pay-confirm',
				url: '/pay-confirm/:type'
				views:
					'menuContent':
						templateUrl: 'templates/pay-confirm.html'
						controller:'PayConfirmCtrl as ctrl'

			.state 'app.tickets',
				url: '/tickets'
				views:
					'menuContent':
						templateUrl: 'templates/tickets.html'
						controller: 'TicketsCtrl'
				data:
					permissions:
						only: [roles.user]

			.state 'app.rewards',
				url: '/rewards'
				views:
					'menuContent':
						templateUrl: 'templates/rewards.html'
				data:
					permissions:
						only: [roles.user]

			.state 'app.statistics',
				url: '/statistics'
				views:
					'menuContent':
						templateUrl: 'templates/statistics.html'
				data:
					permissions:
						only: [roles.user]

			.state 'app.messages',
				url: '/messages'
				views:
					'menuContent':
						templateUrl: 'templates/messages.html'
						controller: 'MessageCtrl'

			.state 'app.message-detail',
				url: '/message/:id'
				views:
					'menuContent':
						templateUrl: 'templates/message-detail.html'
						controller: 'MessageDetailCtrl'

			.state 'app.setting',
				url: '/setting'
				views:
					'menuContent':
						templateUrl: 'templates/setting.html'
						controller: 'SettingCtrl as ctrl'
				data:
					permissions:
						only: [roles.user]

			.state 'app.aboutme',
				url: '/aboutme'
				views:
					'menuContent':
						templateUrl: 'templates/aboutme.html'

			.state 'app.profile',
				url: '/profile'
				views:
					'menuContent':
						templateUrl: 'templates/profile.html'
				data:
					permissions:
						only: [roles.user]

			.state 'app.signup',
				url: '/signup'
				views:
					'menuContent':
						templateUrl: 'templates/signup.html'
						controller: 'SignupCtrl as ctrl'

			.state 'app.smsverify',
				url: '/sms'
				views:
					'menuContent':
						templateUrl: 'templates/sms.html'
						controller: 'SmsCtrl as ctrl'

			.state 'app.createprofile',
				url: '/createprofile/:id'
				views:
					'menuContent':
						templateUrl: 'templates/newprofile.html'
						controller: 'NewProfileCtrl as ctrl'
				
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
				# data:
				# 	permissions:
				# 		only: [roles.admin]

			.state 'app.test-native', 
				url: '/native'
				views:
					'menuContent':
						templateUrl: 'templates/native-test.html'
						controller: 'NativeTestCtrl as ctrl'

			.state 'app.login',
				url: '/login'
				views:
					'menuContent':
						templateUrl: 'templates/login.html'

			.state 'app.energy',
				url: '/energy'
				views:
					'menuContent':
						templateUrl: 'templates/home/energy2.html'
						controller: 'EnergyFlowCtrl as ctrl'
				

		$urlRouterProvider.otherwise '/app/home/video/1'



angular.module('app').config ['$stateProvider', '$urlRouterProvider', 'userRoles', Config]
