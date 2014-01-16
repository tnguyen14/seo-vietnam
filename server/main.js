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
	// update professions type based on a json file declaration
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
	});
	// add location and profession to completed applications
	// set to 'local' if user is in Vietnam, 'overseas' otherwise
	// analyze number of professions to determine whether 'business' or 'non-business'
	var apps = Applications.find({status:'completed'}).fetch(),
		whichProfession = function(prof) {
			var professions = Information.findOne({category: 'profession'}).values;
			// find the type of the profession
			return Lazy(professions).findWhere({
				slug: prof
			}).type;
		}
	Lazy(apps).each(function(a){
		// Location
		var user = Meteor.users.findOne(a.user),
			location,
			prof_type = professionTally(a);
		// only update location if it wasn't defined before
		if (!a.location) {
			location = locationType(user);
			if (location) {
				Applications.update(a.Id, {$set: {location: location}});
			}
		}
		Applications.update(a._id, {$set: {'profession_type': prof_type}});
	});
});