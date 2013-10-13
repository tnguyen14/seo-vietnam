Meteor.subscribe('information');

Template.professional.helpers({
	'checked': function (slug, values) {
		if (_.contains(values, slug)) {
			return 'checked';
		}
	}
});

Template.professional.industries = function() {
	return Information.find({category: 'industry'}).fetch()[0].values;
};
Template.professional.professions = function() {
	return Information.find({category: 'profession'}).fetch()[0].values;
};