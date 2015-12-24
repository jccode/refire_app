
class BuslocationCtrl
	constructor: (@$scope, @$q, @$cordovaGeolocation)->
		height = document.getElementById("maplocation").offsetHeight
		document.getElementById("map").style.height = height+"px"

		@get_current_pos().then (pos)=>
			@currpos = pos
			@init_map @currpos
			@simulate_bus_pos(pos)
			@show_route()

	init_map: (pos)->
		@map = new BMap.Map "map"
		@map.centerAndZoom(new BMap.Point(pos.longitude, pos.latitude), 12)

	simulate_bus_pos: (pos)->
		@buspos =
			longitude: pos.longitude + Math.random()/10
			latitude: pos.latitude + Math.random()/10
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

		# myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/fox.gif", new BMap.Size(300,157))
		# start.marker.setIcon(myIcon)
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

	get_current_pos: ->
		posOptions =
			timeout: 3000
			enableHighAccuracy: true
		fallback_pos =
			longitude: 116.404
			latitude: 39.915
		defer = @$q.defer()
		@$cordovaGeolocation.getCurrentPosition(posOptions)
			.then (pos)->
				defer.resolve pos.coords
			, (err) ->
				console.log 'Fail to get current postion. Use fallback postion instead.'
				defer.resolve fallback_pos
		defer.promise;


angular.module('app').controller 'BuslocationCtrl', [
	'$scope',
	'$q',
	'$cordovaGeolocation',
	BuslocationCtrl
]
