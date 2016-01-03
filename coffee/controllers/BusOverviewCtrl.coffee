
class BusOverviewCtrl
	constructor: (@$scope, @$rootScope, @$localStorage, @$interval, @BusData, @storageKey)->
		@bus = @$rootScope.bus
		#console.log @bus
		if @bus and @bus.bid
			@getdata()
			@auto_refresh()
			
		# destroy
		@$scope.$on "$destroy", ()=>
			if @refresh_timer
				@$interval.cancel @refresh_timer

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
	'BusData',
	'storageKey',
	BusOverviewCtrl
	]
