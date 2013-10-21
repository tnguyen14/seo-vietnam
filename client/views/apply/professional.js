Meteor.subscribe('information');

Template.professional.industries = function() {
	return Information.find({category: 'industry'}).fetch()[0].values;
};
Template.professional.professions = function() {
	return Information.find({category: 'profession'}).fetch()[0].values;
};