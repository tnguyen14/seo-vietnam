if (Meteor.isServer) {
	Lazy = Meteor.require('lazy.js');
}
// return the type of profession based on the Information database
// @param {String} profession slug
// @return {String} type of profession, usually 'business' or 'non-business'
function whichProfession(prof) {
	var professions = Information.findOne({category: 'profession'}).values;
	// find the type of the profession
	return Lazy(professions).findWhere({slug: prof}).type;
}

// analyze the professions declared in application and determine which profession type is dominant
// @param {Object} app object
// @return {String|undefined} the dominant profession type, usually 'business' or 'non-business', or 'both', or undefined.
professionTally = function(app) {
	var tally = Lazy(app.profession).countBy(whichProfession),
		businessCount = tally.get('business'),
		nonBusinessCount = tally.get('non-business'),
		prof_type;

	// for those without either business or non-business
	if (!businessCount && !nonBusinessCount) {
		prof_type = undefined;
	} else if (!businessCount) {
		prof_type = 'non-business';
	} else if (!nonBusinessCount) {
		prof_type = 'business';
	} else {
		if (businessCount === nonBusinessCount) {
			prof_type = 'both';
		} else if(businessCount > nonBusinessCount) {
			prof_type = 'business';
		} else {
			prof_type = 'non-business';
		}
	}
	return prof_type;
}

// update application location based on user setting
// @param {Object} user object
// @return {String|undefined}
locationType = function(user) {
	if (user.profile && user.profile['country-residence']) {
		return (user.profile['country-residence'] === 'vietnam') ? 'local' : 'overseas';
	}
}