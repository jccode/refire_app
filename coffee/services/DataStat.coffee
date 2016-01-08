
class DataStatSrv
	constructor:(@$http)->
		console.log 'data stat'


angular.module('app').server 'DataStat', [
	'$http',
	DataStatSrv
]
