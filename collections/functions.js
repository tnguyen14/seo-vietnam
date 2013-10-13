Functions = new Meteor.Collection('functions');

Functions.allow({
	insert: function() {
		return true;
	}
});