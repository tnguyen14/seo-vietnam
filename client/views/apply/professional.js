Meteor.subscribe('industries');
Meteor.subscribe('functions');

Template.professional.helpers({
	'checked': function (slug, values) {
		if (_.contains(values, slug)) {
			return 'checked';
		}
	}
});

Template.professional.industries = function() {
	return Industries.find();
};
Template.professional.functions = function() {
	return Functions.find();
};