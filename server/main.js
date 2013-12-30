Meteor.startup(function(){
	// set up superadmin
	var superAdminEmail = process.env.ADMIN_EMAIL || Meteor.settings.admin.email,
		user = Meteor.users.findOne({
			emails: {
				$elemMatch: { address: superAdminEmail }
			}
		});
	if (user) {
		var newRoles = [];
		if (!_.contains(user.roles, 'admin')) {
			newRoles.push('admin');
		}
		if (!_.contains(user.roles, 'super-admin')) {
			newRoles.push('super-admin');
		}
		if (newRoles.length > 0) {
			Meteor.users.update({_id: user._id}, {
				$pushAll: {
					roles: newRoles
				}
			});
		}
	}
});