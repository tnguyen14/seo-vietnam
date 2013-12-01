Meteor.subscribe('applications');

Template.login.rendered = function() {
	if (Meteor.user()) {
		Meteor.Router.to('/apply');
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
				$('.alert', $form).show().alert().find('.message').html(err.reason);
				return ;
			}
			newApplication();
			Meteor.Router.to('/apply');
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
			if (err) {
				$('.alert', $form).show().alert().find('.message').html(err.reason);
				return ;
			}
			Meteor.Router.to('/apply');
		});
	},
	"click .close": function(e) {
		e.preventDefault();
		$(e.target).parent('.alert').hide();
	}
}