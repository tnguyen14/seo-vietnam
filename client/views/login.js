Meteor.subscribe('applications');

Template.login.events = {
	'click #start-button': function(e) {
		e.preventDefault();
		var $form = $("#register");
		$form.validate({
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

		if ($form.valid()) {
			var email = $(".login-email", $form).val().trim(),
				password = $(".login-password", $form).val().trim();
			Accounts.createUser({
				email: email,
				password: password
			}, function(err) {
				if (err) {
					console.log(err.message);
					return ;
				}
				Applications.insert({
					user: Meteor.userId()
				});
				Meteor.Router.to('/apply');
			});
		}
	},
	"click #login-button": function(e) {
		e.preventDefault();
		var $form = $("#login");
		$form.validate({
			rules: {
				email: {
					email: true,
					required: true
				},
				password: {
					required: true
				}
			}
		});

		if ($form.valid()) {
			var email = $(".login-email", $form).val().trim(),
				password = $(".login-password", $form).val().trim();
			Meteor.loginWithPassword(email, password, function(err) {
				if (err) {
					console.log(err.message);
					return ;
				}
				Meteor.Router.to('/apply');
			});
		}
	}
}