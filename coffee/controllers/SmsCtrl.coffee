
class SmsCtrl
	constructor: (@$scope, @$state, @$interval, @$sessionStorage, @storageKey, @gettextCatalog, @sms, @auth)->
		@COUNTDOWN = 90
		@countdown = 0
		@setButton("V")
		@user = @$sessionStorage[@storageKey.SIGNUP_USER]
		@initSms()

	initSms: ->
		@sendSms @user['username'], @successCallback.bind(@), @errorCallback.bind(@)

	sendSms: (phone, success, failed)->
		if @countdown <= 0
			@sms.send phone
				.then (ret)=>
					success ret.data
				, (err)=>
					failed err
		# success 1024
		# failed @gettextCatalog.getString 'send sms failed'

	successCallback: (code)->
		@receivecode = code
		@countdown = @COUNTDOWN
		@setButton('V')
		@startCountdown()

	errorCallback: (err)->
		@showError(err)

	startCountdown: ()->
		@timer = @$interval ()=>
			if @countdown > 0
				@countdown--
			else
				@$interval.cancel @timer
				@timer = undefined
				# console.log 'cancel'
				# console.log @timer
				@afterCountdown()
		, 1000

	afterCountdown: ()->
		@setButton("S")

	doVerify: ()->
		return @countdown > 0 and @receivecode.toString() is @verifycode.toString()

	verify: ()->
		if @doVerify()
			@signup()
		else
			@showError('sms code not match!')

	setButton: (state)->
		if state is 'S'
			@buttontext = "Resend"
			@buttonstate = "S"
		else
			@buttontext = "Verify"
			@buttonstate = "V"

	action: ()->
		if @buttonstate is 'V'
			@verify()
		else
			@verifycode = ""
			@error = ""
			@initSms()

	showError: (err)->
		@error = err

	signup: ()->
		@auth.signup @user, (user)=>
			console.log 'signup success'
			console.log user
			@next()
		, (err) ->
			console.log 'signup error'
			console.log err
			@showError 'signup failed. #{err}'

	next: ->
		@$state.go 'app.createprofile'


angular.module('app').controller 'SmsCtrl', [
	'$scope',
	'$state',
	'$interval',
	'$sessionStorage',
	'storageKey',
	'gettextCatalog',
	'Sms',
	'Auth',
	SmsCtrl
]
