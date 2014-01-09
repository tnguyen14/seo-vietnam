Template['grade-register'].rendered = function() {
	if (Meteor.user()) {
		if (hasRole('grader', Meteor.user())) {
			Router.go('grade-temp')
		} else {
			notify({
				message: 'You\'re already a user of the site. If you\'d like to beome a grader, please contact us.',
				context: 'warning',
				dismissable: true
			});
		}
	}
	$("#grade-register").validate({
		rules: {
			email: {
				email: true,
				required: true

			},
			password: {
				required: true,
				minlength: 6
			},
			grade_secret: {
				required: true
			}
		},
		messages: {
			password: {
				minlength: "Your password needs to be at least 6 characters long"
			}
		}
	});
}

Template['grade-register'].events = {
	'click #register-button': function(e) {
		e.preventDefault();
		var $form = $('#grade-register');
		if (!$form.valid() || Meteor.user()) {
			return;
		}
		var email = $(".login-email", $form).val().trim(),
			password = $(".login-password", $form).val().trim(),
			secret = $("#grade-secret", $form).val().trim();

		Meteor.call('checkGraderSecret', secret, function(err, res) {
			if (err) {
				console.log(err);
				notify({
					message: err.reason,
					context: 'danger',
					dismissable: true,
					clearPrev: true
				});
				return;
			}
			Accounts.createUser({
				email: email,
				password: password,
				profile: {
					roles: ['grader']
				}
			}, function(err) {
				if (err) {
					notify({
						message: err.reason,
						context: 'danger',
						dismissable: true,
						clearPrev: true
					});
					return;
				}
				Router.go('grade-profile');
			})
		})
	}
}