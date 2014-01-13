Meteor.startup(function(){
	// set up superadmin
	var Lazy = Meteor.require('lazy.js');
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
	// update professions type
	Assets.getText('professions.json', function(err, res) {
		if (!err) {
			var professions = JSON.parse(res),
				currentProfs = Information.findOne({category: 'profession'}).values;
			Lazy(professions).each(function(p) {
				currentP = Lazy(currentProfs).findWhere({slug: p.slug});
				currentP.type = p.type;
			});
			Information.update({category: 'profession'}, {$set: {values: currentProfs}});
		}
	})
});