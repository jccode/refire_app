
class HomeCtrl
	constructor: (@$scope, @$ionicSideMenuDelegate, @$state)->
		@$scope.onReadySwiper = (swiper)=>
			# swiper.on "slideChangeStart", (swiper)->
			# 	console.log 'changed. active:'+ swiper.activeIndex+"; clicked:"+swiper.clickedIndex
			# 
			swiper.on "click", (swiper)=>
				console.log "click "+swiper.clickedIndex
				idx = swiper.clickedIndex
				item = swiper.slides[idx]
				@load_detail item
		
		@bind_click_event()

	bind_click_event: ()->
		sc = document.getElementById "swiper-container"
		sc.addEventListener "tap", @click_handler.bind(@), false

	find_ancestor: (el, cls)->
		while ((el = el.parentElement) && !el.classList.contains(cls))
			# nothing need to do here
			"a"
		el

	click_handler: (ev)->
		el = ev.target
		item = @find_ancestor el, "swiper-slide"
		@load_detail item

	load_detail: (item)->
		url = item.getAttribute "href"
		state = item.getAttribute 'data-state'
		param = item.getAttribute 'data-param'
		@$state.go state, param && JSON.parse(param) || {}


angular.module('app').controller 'HomeCtrl', [
	'$scope',
	'$ionicSideMenuDelegate',
	'$state',
	HomeCtrl
]
