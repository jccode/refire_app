
class TrustedFilter
	constructor: ($sce) ->
		return (url, type) ->
			if type and type is 'html'
				$sce.trustAsHtml url
			else
				$sce.trustAsResourceUrl url


angular.module('app').filter 'trusted', ['$sce', TrustedFilter]
