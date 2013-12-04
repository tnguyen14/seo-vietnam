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
			},
			toefl: {
				number: true,
				range: [0, 120]
			},
			ielts: {
				number: true,
				range: [0, 9]
			},
			gre: {
				number: true,
				range: [0, 6]
			},
			gmat: {
				number: true,
				range: [200, 800]
			}
		}
	})
};

Template.qualifications.helpers({
	'language-checked': function (slug, level) {
		var app = currentApp();
		if (!app) {
			return;
		}
		var languages =  app.language;
		if (languages && _.contains(languages[slug], level)) {
			return 'checked';
		}
	}
});

Template.qualifications.languages = function() {
	return getInfo('language');
};