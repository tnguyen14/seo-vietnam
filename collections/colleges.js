Colleges = new Meteor.Collection('colleges');

Colleges.allow({
	insert: function() {
		return true;
	}
});