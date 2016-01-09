
class BuslocationCtrl
	constructor: (@$scope, @$q, @$localStorage, @$cordovaGeolocation, @util, @storageKey)->
		height = document.getElementById("maplocation").offsetHeight - 190
		document.getElementById("map").style.height = height+"px"
		
		@init_fallback_pos()
		
		@fallback_pos = @storage[@storageKey.LAST_POSITION]
		
		@init_map @fallback_pos
		
		@get_current_pos().then (pos)=>
			@currpos = pos
			@map.panTo pos
			#@simulate_bus_pos(pos)
			#@show_route()
			@demo_route()
		, (ret)=>
			console.log "get position failed."

	init_fallback_pos: ()->
		fallback = {}
		fallback[@storageKey.LAST_POSITION] =
			longitude: 113.0989
			latitude: 23.004068
		@storage = @$localStorage.$default fallback

	init_map: (pos)->
		@map = new BMap.Map "map"
		@map.centerAndZoom(new BMap.Point(pos.longitude, pos.latitude), 12)

	simulate_bus_pos: (pos)->
		@buspos =
			longitude: pos.longitude + Math.random()/20
			latitude: pos.latitude + Math.random()/20
		@buspos

	show_positions: (positions)->
		# console.log positions
		[start, end] = positions
		start.title = "Your position"
		end.title = "M474 5 mins"
		
		start.marker.setTitle "Your position"
		end.marker.setTitle "M474 5 mins"

		startLabel = new BMap.Label "YOUR POSITION", {offset: new BMap.Size(-25,-50)}
		endLabel = new BMap.Label "M474<br> 5 mins", {offset: new BMap.Size(-25,-50)}

		@set_label_style startLabel, '#339966'
		@set_label_style endLabel, '#0099ff'
		
		start.marker.setLabel startLabel
		end.marker.setLabel endLabel

		sicon = new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(39,25))
		start.marker.setIcon(sicon)
		eicon = new BMap.Icon("img/bus.png", {offset: new BMap.Size(32,32)})
		end.marker.setIcon eicon
		

	set_label_style: (label, bgColor)->
		label.setStyle {
			color: '#fff'
			fontWeight: 'bold'
			fontSize: '12px'
			background: bgColor
			border: 'none'
			borderRadius: "8px"
			padding: '10px'
			width: '80px'
			height: '50px'
			whiteSpace: 'normal'
			textAlign: 'center'
			}

	show_route: ->
		p1 = new BMap.Point @currpos.longitude, @currpos.latitude
		p2 = new BMap.Point @buspos.longitude, @buspos.latitude
		# driving = new BMap.TransitRoute @map, 
		driving = new BMap.DrivingRoute @map,
			renderOptions:
				map: @map,
				autoViewport: true
			policy: 0
			onMarkersSet: @show_positions.bind @
		driving.search p1, p2

	demo_route: ->
		p1 = new BMap.Point @currpos.longitude, @currpos.latitude
		p2 = new BMap.Point "112.05277", "22.921587"
		driving = new BMap.DrivingRoute @map,
			renderOptions:
				map: @map,
				autoViewport: true
			policy: 0
			onMarkersSet: @demo_positions.bind @
		driving.search p1, p2

	demo_positions: (positions)->
		[start, end] = positions
		start.title = "Your position"
		start.marker.setTitle "Your position"
		startLabel = new BMap.Label "YOUR POSITION", {offset: new BMap.Size(-25,-50)}
		@set_label_style startLabel, '#339966'
		start.marker.setLabel startLabel
		eicon = new BMap.Icon("img/bus.png", {offset: new BMap.Size(32,32)})
		start.marker.setIcon(eicon)

	get_current_pos: ->
		posOptions =
			timeout: 10000
			enableHighAccuracy: true
		defer = @$q.defer()
		@$cordovaGeolocation.getCurrentPosition(posOptions)
			.then (pos)=>
				ret = pos.coords
				@storage[@storageKey.LAST_POSITION] = ret
				# console.log ret
				# console.log @storage[@storageKey.LAST_POSITION]
				defer.resolve ret
			, (err) =>
				console.log 'Fail to get current postion. Use fallback postion instead.'
				console.log err.code+","+err.message
				@util.toast "Get current postion failed. #{err.code}:#{err.message}"
				defer.reject false
		defer.promise;


angular.module('app').controller 'BuslocationCtrl', [
	'$scope',
	'$q',
	'$localStorage',
	'$cordovaGeolocation',
	'Util',
	'storageKey',
	BuslocationCtrl
]
