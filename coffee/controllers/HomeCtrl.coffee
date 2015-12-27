
class HomeCtrl
	constructor: (@$scope, @$ionicSideMenuDelegate)->
		# console.log 'home ctrl'
		@$scope.onReadySwiper = (swiper)->
			# do something here
			console.log "swiper ready"
			window.swiper = swiper
			
			swiper.on "slideChangeStart", (swiper)->
				console.log 'changed. active:'+ swiper.activeIndex+"; clicked:"+swiper.clickedIndex

			swiper.on "click", (swiper)->
				console.log "click "+swiper.clickedIndex
				console.log swiper


angular.module('app').controller 'HomeCtrl', [
	'$scope',
	'$ionicSideMenuDelegate',
	HomeCtrl
]
