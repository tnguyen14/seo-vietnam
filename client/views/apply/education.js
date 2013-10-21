Meteor.subscribe('information');

// Template Helpers
Template.education.helpers({
	'selected': function(slug, value) {
		if (slug === value) {
			return 'selected';
		}
	}
});

Template.education.events = {
	'click .add-field': function(e) {
		e.preventDefault();
		var $wrap = $(e.target).closest('.form-group');
		$wrap.append(Template['major']);
	}
}

Template.education.majors = function() {
	return Information.find({category: 'major'}).fetch()[0].values;
};


Template.education.colleges = function() {
	return Information.find({category: 'college'}).fetch()[0].values;
};