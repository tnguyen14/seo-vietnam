Majors = new Meteor.Collection('majors');

Majors.allow({
	insert: function() {
		return true;
	}
});