Meteor.subscribe('information');
Meteor.subscribe('applications');

Template.qualifications.rendered = function() {
	$("#qualifications").validate({
		rules: {
			reading: {
				number: true,
				range: [0, 800]
			},
			writing: {
				number: true,
				range: [0, 800]
			},
			math: {
				number: true,
				range: [0, 800]
			}
		}
	})
};

Template.qualifications.helpers({
	'language-checked': function (slug, level) {
		var languages =  currentApp().language;
		if (_.contains(languages[slug], level)) {
			return 'checked';
		}
	}
});

Template.qualifications.languages = function() {
	return getInfo('language');
};