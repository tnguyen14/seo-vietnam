Meteor.subscribe('languages');

Template.qualifications.languages = function() {
	return Languages.find();
}
