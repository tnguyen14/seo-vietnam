Template.login.rendered = function() {
	if (Meteor.user()) {
		Router.go('apply');
	}

	$("#login").validate({
		rules: {
			email: {
				email: true,
				required: true

			},
			password: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			password: {
				minlength: "Your password needs to be at least 6 characters long"
			}
		}
	});
}

Template.login.events = {
	'click #register-button': function(e) {
		e.preventDefault();
		var $form = $('#login');
		if (!$form.valid()) {
			return;
		}
		var email = $(".login-email", $form).val().trim(),
			password = $(".login-password", $form).val().trim();
		Accounts.createUser({
			email: email,
			password: password,
			profile: {
				roles: ['applicant']
			}
		}, function(err) {
			if (err) {
				notify({
					message: err.reason,
					context: 'warning'
				});
			} else {
				newApplication(function(err, appId){
					if (err) {
						notify({
							message: err.message,
							context: 'warning'
						});
					} else {
						console.log('successfully created app: ' + appId);
						Router.go('apply');
					}
				});
			}
		});
	},
	"click #signin-button": function(e) {
		e.preventDefault();
		var $form = $("#login");
		if (!$form.valid()) {
			return;
		}
		var email = $(".login-email", $form).val().trim(),
			password = $(".login-password", $form).val().trim();
		Meteor.loginWithPassword(email, password, function(err) {
			clearNotifications();
			if (err) {
				notify({
					message: err.reason,
					context: 'warning'
				});
				return ;
			}
			if (currentApp().status === 'completed') {
				Router.go('profile');
			} else {
				Router.go('apply');
			}
		});
	}
}

Template['forgot-password'].rendered = function() {
	$('#forgot-password').validate({
		rules: {
			email: {
				email: true,
				required: true
			}
		}
	});
}

Template['forgot-password'].events = {
	"click #forgot-button": function(e) {
		e.preventDefault();
		var $form = $('#forgot-password'),
			key = 'forgot-password-prev-request',
			denyMessage = 'Forgot password requests cannot be made within an hour of each other. Please try again later.';
		if (!$form.valid()) {
			return;
		}
		 var email = $form.find(".login-email").val().trim();
		// deny request if it has been sent recenty
		if (Modernizr && Modernizr.localstorage) {
			var prevReq = localStorage.getItem(key);

			if (prevReq) {
				prevReq = JSON.parse(prevReq);
				if (moment().isBefore(prevReq.expires)) {
					notify({
						message: denyMessage,
						context: 'warning',
						auto: true
					});
					return;
				}
			}
		} else {
			if ($.cookie(key)) {
				notify({
					message: denyMessage,
					context: 'warning',
					auto: true
				});
				return;
			}
		}
		Accounts.forgotPassword({email: email}, function(error) {
			if (error) {
				notify({
					message: error.message,
					context: 'warning',
					dismissable: true
				});
			} else {
				notify({
					message: 'An email has been sent to ' + email,
					context: 'success',
					dismissable: true
				});

				var now = new Date(),
					time = now.getTime();
				// wait for an hour
				time += 3600 * 1000;
				now.setTime(time);

				if (Modernizr && Modernizr.localstorage) {

					localStorage.setItem(key, JSON.stringify({
						submitted: true,
						expires: now
					}));
				} else {
					// use cookie if localstorage is not supported
					$.cookie(key, true, {expires: now});
				}
			}
		});
	}
}

Template['reset-password'].rendered = function() {
	$('#reset-password').validate({
		rules: {
			password: {
				required: true
			}
		}
	});
}

Template['reset-password'].events = {
	"click #reset-button": function(e) {
		e.preventDefault();
		var $form = $('#reset-password');
		if (!$form.valid()) {
			return;
		}
		var newPass = $form.find(".login-password").val().trim(),
			token = $form.data('token');
		if (token) {
			Accounts.resetPassword(token, newPass, function(error) {
				if (error) {
					console.log(error);
				} else {
					notify({
						message: 'Your password has been reset successfully! Logging you in...',
						context: 'success',
						auto: true,
						timeout: 5000
					});
					Meteor.setTimeout(function() {
						Router.go('apply');
					}, 5000);
				}
			});
		}
	}
}