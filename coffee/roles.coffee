
class Roles
	constructor: (Permission, $rootScope) ->
		$rootScope.roles = ['user', 'admin']
		Permission.defineManyRoles ['user','admin'], (stateParams, roleName)->
			return roleName in $rootScope.roles


angular.module('app').run ['Permission', '$rootScope', Roles]
