Meteor.subscribe('information');

Template.education.majors = function() {
	return Information.find({category: 'major'}).fetch()[0].values;
};


Template.education.colleges = function() {
	return Information.find({category: 'college'}).fetch()[0].values;
};