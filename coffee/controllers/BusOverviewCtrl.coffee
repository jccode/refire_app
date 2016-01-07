
class BusOverviewCtrl
	constructor: (@$scope, @$rootScope, @$localStorage, @$interval, @gettextCatalog, @BusData, @storageKey, @event)->
		@bus = @$rootScope.bus
		if @bus and @bus.bid
			@demodata = false
			@getdata()
			@auto_refresh()
		else
			@init_demo_data()

		@init_event()

	init_event: ->
		@$scope.$on @event.ENTER_BUS, (bus)=>
			@bus = bus
			@getdata()
		
		# destroy
		@$scope.$on "$destroy", ()=>
			if @refresh_timer
				@$interval.cancel @refresh_timer

	init_demo_data: ()->
		@demodata = true
		@data =
			MileageData:
				total: 211
				remain: 143200
			BusData:
				latitude: 31.2000
				longitude: 121.5000
				speed: 120
			GasData:
				remain: 100
				bottle_temp: 32
			FuelCellData:
				voltage: 12
				current: 10
			PowerBatteryData:
				remain: 80
				voltage: 12
				current: 10
				temp: 40
			MotorData:
				speed: 1200
				voltage: 12
				current: 10
				temp: 40
			EnergySavingData:
				energy_saving_amount: 100
				energy_saving_money: 2143
				emission_reduction: 320
				
		@$scope.popup_login = ()=>
			@$rootScope.$broadcast @event.REQUIRE_LOGIN, ''

	getdata: ()->
		@BusData.busdata @bus.bid
			.then (ret)=>
				@data = ret.data
				@calc_refresh_time()
				@set_battery "h2", @data.GasData.remain
				@set_battery "bat", @data.PowerBatteryData.remain

	auto_refresh: ()->
		@refresh_rate = @$localStorage[@storageKey.SETTING_REFRESH_RATE]
		if @refresh_rate && @refresh_rate > 0
			@refresh_timer = @$interval ()=>
				console.log 'loaddata'
				@getdata()
			, @refresh_rate * 1000

	calc_refresh_time: ()->
		_t = (s)->
			s && moment(s).toDate() || s
		time = [
			_t(@data.PowerBatteryData.timestamp),
			_t(@data.GasData.timestamp),
			_t(@data.FuelCellData.timestamp),
			_t(@data.BusData.timestamp),
			_t(@data.EnergySavingData.timestamp),
			_t(@data.MileageData.timestamp),
			_t(@data.MotorData.timestamp)
		]
		@refresh_time = _.max time

	set_battery: (id, val)->
		@reset_battery id
		el = document.getElementById id
		cs = el.children
		if val >= 10
			cs[9].className = "cell bg-red-1"
		if val >= 20
			cs[8].className = "cell bg-red-1"
		if val >= 30
			cs[7].className = "cell bg-orange-1"
		if val >= 40
			cs[6].className = "cell bg-orange-1"
		if val >= 50
			cs[5].className = "cell bg-orange-1"
		if val >= 60
			cs[4].className = "cell bg-green-2"
		if val >= 70
			cs[3].className = "cell bg-green-2"
		if val >= 80
			cs[2].className = "cell bg-green-2"
		if val >= 90
			cs[1].className = "cell bg-green-1"
		if val >= 100
			cs[0].className = "cell bg-green-1"

	reset_battery: (id)->
		el = document.getElementById id
		e.className = "cell" for e in el.children

	doRefresh: ()->
		@getdata()
		@$scope.$broadcast('scroll.refreshComplete');

angular.module('app').controller 'BusOverviewCtrl', [
	'$scope',
	'$rootScope',
	'$localStorage',
	'$interval',
	'gettextCatalog',
	'BusData',
	'storageKey',
	'event',
	BusOverviewCtrl
	]
