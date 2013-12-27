Meteor.subscribe('information');

Template.professional.industries = function() {
	return getInfo('industry');
};
Template.professional.professions = function() {
	return getInfo('profession');
};