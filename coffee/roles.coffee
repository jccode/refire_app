
class Roles
	constructor: (Permission, $rootScope, auth, roles) ->
		declare_roles = [roles.user, roles.admin]
		Permission.defineManyRoles declare_roles, (stateParams, roleName)->
			return auth.authorize roleName


angular.module('app').run ['Permission', '$rootScope', 'Auth', 'userRoles', Roles]
