

class BeaconState
	constructor: (@$rootScope, @$localStorage, @event, @$timeout, @BeaconCheckin)->

	enter_bus: (bus)->
		#console.log ' ---------- ENTER BUS ---------- '
		if @$rootScope.bus and @$rootScope.bus.bid is bus.bid
			@update_ts()
		else
			@save_bus bus
			@BeaconCheckin.checkin bus.bid, @BeaconCheckin.event.ENTER
			@$rootScope.$broadcast @event.ENTER_BUS, bus

	leave_bus: (bus)->
		@leaveTimer = @$timeout ()=>
			# leave
			@save_bus null
			@BeaconCheckin.checkin bus.bid, @BeaconCheckin.event.LEAVE
			@$rootScope.$broadcast @event.LEAVE_BUS, bus
		, 30*1000

	on_bus: (bus)->
		# clear leaveTimer if needed, checkin on server
		if @leaveTimer
			@$timeout.cancel @leaveTimer
		console.log '---------- ON BUS ----------'
		@update_ts()
		# @BeaconCheckin.checkin bus.bid, @BeaconCheckin.event.STAY

	save_bus: (bus)->
		@$rootScope.bus = bus
		@$localStorage.bus = bus
		@update_ts()

	update_ts: ()->
		now = new Date()
		@$rootScope.beacon_last_ts = now
		@$localStorage.beacon_last_ts = now

	load_state: ()->
		@$rootScope.bus = @$localStorage.bus
		@$rootScope.beacon_last_ts = @$localStorage.beacon_last_ts
		

class BeaconModel
	constructor: (@identifier, @uuid, @major, @minor, @buses)->

		
class BeaconManager
	constructor: ()->
		

	init_beacon_models: (data)->
		@beacon_models = []
		@beacon_models.push new BeaconModel(d.identifier, d.uuid, d.major, d.minor, d.stick_on) for d in data

	find_bus: (identifier, uuid, major, minor)->
		###
		major: Optional, maybe undefined
		minor: Optional, maybe undefined
		###
		if major
			predicator = (m)->
				m.identifier is identifier and m.uuid is uuid and m.major is major and m.minor is minor
		else
			predicator = (m)->
				m.identifier is identifier and m.uuid is uuid
				
		ret = _.filter @beacon_models, predicator
		ret[0].buses



angular.module("app").service "BeaconState", [
	'$rootScope',
	'$localStorage',
	'event',
	'$timeout',
	'BeaconCheckin',
	BeaconState
]

angular.module("app").service "BeaconManager", BeaconManager
