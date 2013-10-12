Meteor.subscribe('languages');

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

Template.qualifications.languages = function() {
	return Languages.find();
};