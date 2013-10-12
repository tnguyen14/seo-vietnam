Meteor.subscribe('colleges');
Meteor.subscribe('majors');

// Template Helpers
Template.education.helpers({
	'selected': function(slug, value) {
		if (slug === value) {
			return 'selected';
		}
	}
});

Template.education.majors = function() {
	return Majors.find();
};


Template.education.colleges = function() {
	return Colleges.find();
};