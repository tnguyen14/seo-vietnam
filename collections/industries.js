Industries = new Meteor.Collection('industries');

Industries.allow({
	insert: function() {
		return true;
	}
});