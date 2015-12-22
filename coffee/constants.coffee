

angular.module('app').constant
	'userRoles':
		user: 'user'
		admin: 'admin'
	'event':
		LOGIN: 'login'
		LOGOUT: 'logout'
		SIGNUP: 'signup'
	'storageKey':
		PAY_STEP_SEQNO: 'pay_step_seqno'
		PAY_BUS_LINE: 'pay_bus_line'
		TICKETS: 'tickets'

