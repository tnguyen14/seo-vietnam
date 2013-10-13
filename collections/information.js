Information = new Meteor.Collection('information');

Information.allow({
	update: function() {
		return true;
	}
});