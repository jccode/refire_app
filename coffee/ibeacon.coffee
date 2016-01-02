

class BeaconEventHandler
	constructor: (@beaconManager, @beaconState)->
		@notified = false

	didStartMonitoringForRegion: (event, pluginResult)->
		console.log "[Start monitoring for region] "+(event)
		console.log "[Start monitoring for region] "+JSON.stringify(pluginResult)
		# do nothing

	didDetermineStateForRegion: (event, pluginResult)->
		console.log "[Determine state for region] "+(event)
		console.log "[Determine state for region] "+JSON.stringify(pluginResult)
		if pluginResult['state'] is 'CLRegionStateInside'
			@enterRegion(pluginResult.region)
		else if pluginResult['state'] is 'CLRegionStateOutside'
			@exitRegion(pluginResult.region)

	didRangeBeaconsInRegion: (event, pluginResult)->
		console.log "[Range beacons in region] "+(event)
		console.log "[Range beacons in region] "+JSON.stringify(pluginResult)
		@throttleRangin(pluginResult.region)

	didEnterRegion: (event, pluginResult)->
		console.log "[Enter region] "+(event)
		console.log "[Enter region] "+JSON.stringify(pluginResult)
		@enterRegion(pluginResult.region)
		
	didExitRegion: (event, pluginResult)->
		console.log "[Exit region] "+(event)
		console.log "[Exit region] "+JSON.stringify(pluginResult)
		@exitRegion(pluginResult.region)

	enterRegion: (region)->
		bus = @beaconManager.find_bus(region.identifier, region.uuid, region.major, region.minor)
		console.log JSON.stringify bus
		@beaconState.enter_bus(bus)

	exitRegion: (region)->
		bus = @beaconManager.find_bus(region.identifier, region.uuid, region.major, region.minor)
		@beaconState.leave_bus(bus)

	throttleRangin: (region)->
		_.throttle ()=>
			@rangeRegion(region)
		, 5000

	rangeRegion: (region)->
		console.log ".......... Ranging .........."


class BeaconBootstrap
	constructor: (@$rootScope, @$cordovaBeacon, @$cordovaToast, @Beacons, @beaconManager, @beaconState)->
		@isAndroid = ionic.Platform.isAndroid()
		console.log "beacon bootstrap. isAndroid? #{@isAndroid}"
		@check_bluetooth()
		@beaconState.load_state()

	check_bluetooth: ->
		try
			@$cordovaBeacon.isBluetoothEnabled()
		catch e
			console.log e.toString()
		@$cordovaBeacon.isBluetoothEnabled()
			.then (ret)=>
				console.log "bluetooth enabled? #{ret} "
				if not ret and @isAndroid
					@$cordovaBeacon.enableBluetooth()
				@init_beacons()
				@add_beacon_event_handler()
			.fail (err)=>
				console.log "detect bluetooth failed. #{JSON.stringifty(err)}"
				@toast "detect bluetooth failed. #{JSON.stringifty(err)}"

	init_beacons: ->
		@Beacons.all().$promise
			.then (beacons)=>
				console.log JSON.stringify beacons
				# beaconManager = new BeaconManager beacons
				@beaconManager.init_beacon_models beacons
				bs = _.map beacons, (b)-> {'identifier':b.identifier, 'uuid':b.uuid}
				bs = _.uniq bs, (b)->b.identifier+b.uuid
				console.log JSON.stringify bs
				brNotifyEntryStateOnDisplay = true
				@beacon_regions = _.map beacons, (b)=>
					@$cordovaBeacon.createBeaconRegion b.identifier, b.uuid, null, null, brNotifyEntryStateOnDisplay
				_.each @beacon_regions, (r)=>
					@$cordovaBeacon.startMonitoringForRegion(r)
					@$cordovaBeacon.startRangingBeaconsInRegion(r)

		# event handler
		@beaconEventHandler = new BeaconEventHandler @beaconManager, @beaconState

	add_beacon_event_handler: ->
		@$rootScope.$on "$cordovaBeacon:didStartMonitoringForRegion", @beaconEventHandler.didStartMonitoringForRegion.bind(@beaconEventHandler)
		@$rootScope.$on "$cordovaBeacon:didDetermineStateForRegion", @beaconEventHandler.didDetermineStateForRegion.bind(@beaconEventHandler)
		@$rootScope.$on "$cordovaBeacon:didRangeBeaconsInRegion", @beaconEventHandler.didRangeBeaconsInRegion.bind(@beaconEventHandler)
		@$rootScope.$on "$cordovaBeacon:didEnterRegion", @beaconEventHandler.didEnterRegion.bind(@beaconEventHandler)
		@$rootScope.$on "$cordovaBeacon:didExitRegion", @beaconEventHandler.didExitRegion.bind(@beaconEventHandler)

	toast: (msg)->
		@$cordovaToast.show msg, "short", "bottom"



start = ($rootScope, $ionicPlatform, $cordovaBeacon, $cordovaToast, Beacons, BeaconManager, BeaconState)->
	$ionicPlatform.ready ->
		#new BeaconBootstrap $rootScope, $cordovaBeacon, $cordovaToast, Beacons, BeaconManager, BeaconState
		BeaconState.load_state()
	

angular.module('app').run [
	'$rootScope',
	'$ionicPlatform',
	'$cordovaBeacon',
	'$cordovaToast',
	'Beacons',
	'BeaconManager',
	'BeaconState',
	start
]
