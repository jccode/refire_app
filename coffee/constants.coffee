

angular.module('app').constant
	'userRoles':
		user: 'user'
		driver: 'driver'
		admin: 'admin'
	'event':
		LOGIN: 'login'
		LOGOUT: 'logout'
		SIGNUP: 'signup'
	'storageKey':
		PAY_STEP_SEQNO: 'pay_step_seqno'
		PAY_BUS_LINE: 'pay_bus_line'
		TICKETS: 'tickets'
		SIGNUP_USER: 'signup_user'
		LAST_POSITION: 'last_position'

