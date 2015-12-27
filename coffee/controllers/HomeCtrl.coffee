
class HomeCtrl
	constructor: (@$scope, @$ionicSideMenuDelegate, @$state)->
		@$scope.onReadySwiper = (swiper)=>
			# window.swiper = swiper
			
			# swiper.on "slideChangeStart", (swiper)->
			# 	console.log 'changed. active:'+ swiper.activeIndex+"; clicked:"+swiper.clickedIndex

			swiper.on "click", (swiper)=>
				# console.log "click "+swiper.clickedIndex
				idx = swiper.clickedIndex
				item = swiper.slides[idx]
				url = item.getAttribute "href"
				state = item.getAttribute 'data-state'
				param = item.getAttribute 'data-param'
				# console.log url
				@$state.go state, param && JSON.parse(param) || {}


angular.module('app').controller 'HomeCtrl', [
	'$scope',
	'$ionicSideMenuDelegate',
	'$state',
	HomeCtrl
]
