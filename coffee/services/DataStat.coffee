
class DataStatSrv
	constructor:(@$http, @settings)->
		@url = @settings.baseurl + '/datastat/energysaving/'

	month_archive: (year, month)->
		month = month.toString()
		month = if month.length < 2 then "0"+month else month
		@$http.get @url+"#{year}/#{month}/"

	last_n_month: (n)->
		@$http.get @url+"lastnmonth/#{n}/"

	query: (from, to)->
		@$http.get @url+"query/?from=#{from}&to=#{to}"


angular.module('app').service 'DataStat', [
	'$http',
	'settings',
	DataStatSrv
]
