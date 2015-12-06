
class Roles
	constructor: (Permission, $rootScope, roles) ->
		$rootScope.roles = [roles.user]
		Permission.defineManyRoles [roles.user, roles.admin], (stateParams, roleName)->
			return roleName in $rootScope.roles


angular.module('app').run ['Permission', '$rootScope', 'userRoles', Roles]
