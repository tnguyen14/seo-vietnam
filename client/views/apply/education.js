Meteor.subscribe('information');

Template.education.majors = function() {
	return getInfo('major');
};


Template.education.colleges = function() {
	return getInfo('college');
};