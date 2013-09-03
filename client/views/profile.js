Meteor.subscribe('applications');
Meteor.subscribe('industries');

// get name from slug
var getName = function(slug, collection) {
	var doc = _.find(collection.find().fetch(),
		function(d){
			return d.slug === slug;
		});
	return doc.name;
};

Template.profile.helpers({
	user: function(){
		return FakeUsers.findOne({_id: Session.get('userId')});
	},
	displayname: function() {
		return this.name.first + " " + this.name.last;
	},
	app: function() {
		return Applications.findOne({user: Session.get('userId')});

	},
	college: function() {
		return Colleges.findOne({slug: this.college}).name;
	},
	getIndustryName: function(slug) {
		return getName(slug, Industries);
	},
});