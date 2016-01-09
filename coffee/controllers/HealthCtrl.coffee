
class HealthCtrl
	constructor: (@$rootScope, @$scope, @$stateParams, @gettextCatalog, @moment, @auth, @event, @DataStat, @util) ->
		@$scope.type = @$stateParams.type

		@init_date_select()
		now = new Date()
		@init_1m(now)

		@$scope.total_distance = '400 KM'
		@$scope.total_energy_saving = '300 KMK'
		@$scope.total_emission_reduction = '200 KWH'

		@$scope.demodata = if @auth.isLoggedIn() then false else true
		
		@$scope.onTabSelect = (type) =>
			@$scope.type = type
			@$scope.data = [[]]
			@$scope.show_total = true
			switch type
				when 1 then @init_1m(now)
				when 2 then @init_3m(now)
				when 3 then @init_6m(now)
				else @init_period()

		@$scope.search = ()=>
			#console.log @$scope.from + ";" + @$scope.to
			@search_by_period()

		@$scope.popup_login = ()=>
			@$rootScope.$broadcast @event.REQUIRE_LOGIN, ''

	init_date_select: ->
		@$scope.datepickerFrom =
			callback: (val)=>
				@from_val = val
				@$scope.from = @moment(val).format('YYYY-MM-DD')

		@$scope.datepickerTo =
			callback: (val)=>
				@to_val = val
				@$scope.to = @moment(val).format('YYYY-MM-DD')

	init_chart: ->
		# @$scope.labels = ["January", "February", "March", "April", "May", "June", "July"]
		# @$scope.series = ['Series A', 'Series B']
		# @$scope.data = [
		# 	[65, 59, 80, 81, 56, 55, 40],
		# 	[28, 48, 40, 19, 86, 27, 90]
		# ]
		@$scope.labels = [1..30]
		@$scope.series = ['Series A']
		@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]
		@$scope.onClick = (points, evt) ->
			console.log(points, evt)

	init_1m: (now)->
		year = now.getFullYear()
		month = now.getMonth() + 1
		date = now.getDate()
		@$scope.head = @get_month(now.getMonth()+1)
		@$scope.labels = [1..date]
		if @auth.isLoggedIn()
			@DataStat.month_archive(year, month).then (ret)=>
				@$scope.data = [_.map(ret.data, (d)->d.energy_saving_amount)]
				#@$scope.data = [[10,9,8,7,6,5,4,3]]
		else
			@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]

	init_3m: (now)->
		month = now.getMonth()
		from_month = @_m (month+12-3)%12
		@$scope.head = from_month + " ~ " + @_m(month)
		@$scope.labels = [@_m(from_month), @_m(from_month+1), @_m(from_month+2)]
		if @auth.isLoggedIn()
			@DataStat.last_n_month(3).then (ret)=>
				@$scope.data = [_.map(ret.data, (d)->d.energy_saving_amount)]
		else
			@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]

	init_6m: (now)->
		month = now.getMonth()
		from_month = @_m (month+12-6)%12
		@$scope.head = from_month + " ~ " + @_m(month)
		@$scope.labels = []
		@$scope.labels.push @_m(i) for i in [from_month..from_month+6]
		if @auth.isLoggedIn()
			@DataStat.last_n_month(6).then (ret)=>
				@$scope.data = [_.map(ret.data, (d)->d.energy_saving_amount)]
		else
			@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]

	init_period: ->
		@$scope.labels = []
		@$scope.head = ""
		@$scope.data = [[]]
		@$scope.show_total = false

	search_by_period: ->
		if @from_val > @to_val
			@util.toast @gettextCatalog.getString("from date must less than to date.")
			return

		@$scope.show_total = true
		
		fy = @from_val.getFullYear()
		fm = @from_val.getMonth()+1
		fd = @from_val.getDate()
		ty = @to_val.getFullYear()
		tm = @to_val.getMonth()+1
		td = @to_val.getDate()
		
		if fy != ty
			@$scope.head = fy + " ~ " + ty
			@$scope.labels = [fy..ty]
			@$scope.data = [[]]
		else if fm != tm
			@$scope.head = fy + "-" + fm + " ~ " + ty + "-" + tm
			@$scope.labels = [fm..tm]
			#@$scope.data = [[]]
		else
			@$scope.head = @$scope.from + " ~ " + @$scope.to
			@$scope.labels = [fd..td]

		if @auth.isLoggedIn()
			@DataStat.query(@$scope.from, @$scope.to).then (ret)=>
				@$scope.data = [_.map(ret.data, (d)->d.energy_saving_amount)]
		else
			@$scope.data = [(Math.round(Math.random()*100) for i in @$scope.labels)]
			

	get_month: (m)->
		return switch m
			when 1 then @gettextCatalog.getString 'January'
			when 2 then @gettextCatalog.getString 'February'
			when 3 then @gettextCatalog.getString 'March'
			when 4 then @gettextCatalog.getString 'April'
			when 5 then @gettextCatalog.getString 'May'
			when 6 then @gettextCatalog.getString 'June'
			when 7 then @gettextCatalog.getString 'July'
			when 8 then @gettextCatalog.getString 'August'
			when 9 then @gettextCatalog.getString 'September'
			when 10 then @gettextCatalog.getString 'October'
			when 11 then @gettextCatalog.getString 'November'
			when 12 then @gettextCatalog.getString 'December'

	_m: (m) -> if m is 0 then 12 else m


angular.module('app').controller 'HealthCtrl', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'gettextCatalog',
	'moment',
	'Auth',
	'event',
	'DataStat',
	'Util',
	HealthCtrl
]
