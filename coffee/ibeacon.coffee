
class BeaconBootstrap
	constructor: (@$rootScope, @$cordovaBeacon, @$cordovaToast, @Beacons)->
		@isAndroid = ionic.Platform.isAndroid()
		console.log "beacon bootstrap. isAndroid? #{@isAndroid}"
		@check_bluetooth()

	check_bluetooth: ->
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
				bs = _.map beacons, (b)-> {'identifier':b.identifier, 'uuid':b.uuid}
				bs = _.uniq bs, (b)->b.identifier+b.uuid
				console.log JSON.stringify bs
				brNotifyEntryStateOnDisplay = true
				@beacon_regions = _.map beacons, (b)=>
					@$cordovaBeacon.createBeaconRegion b.identifier, b.uuid, null, null, brNotifyEntryStateOnDisplay
				_.each @beacon_regions, @$cordovaBeacon.startRangingBeaconsInRegion

	add_beacon_event_handler: ->
		@$rootScope.$on "$cordovaBeacon:didStartMonitoringForRegion", (event, pluginResult)->
			console.log "[Start monitoring for region] "+(event)
			console.log "[Start monitoring for region] "+JSON.stringify(pluginResult)
			console.log "[Start monitoring for region] -----------------------------"
			
		@$rootScope.$on "$cordovaBeacon:didDetermineStateForRegion", (event, pluginResult)->
			console.log "[Determine state for region] "+(event)
			console.log "[Determine state for region] "+JSON.stringify(pluginResult)
			console.log "[Determine state for region] -----------------------------"
			
		@$rootScope.$on "$cordovaBeacon:didRangeBeaconsInRegion", (event, pluginResult)->
			console.log "[Range beacons in region] "+(event)
			console.log "[Range beacons in region] "+JSON.stringify(pluginResult)
			console.log "[Range beacons in region] -----------------------------"

	toast: (msg)->
		@$cordovaToast.show msg, "short", "bottom"



start = ($rootScope, $ionicPlatform, $cordovaBeacon, $cordovaToast, Beacons)->
	$ionicPlatform.ready ->
		#new BeaconBootstrap $rootScope, $cordovaBeacon, $cordovaToast, Beacons


angular.module('app').run [
	'$rootScope',
	'$ionicPlatform',
	'$cordovaBeacon',
	'$cordovaToast',
	'Beacons',
	start
	]
