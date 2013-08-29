Meteor.subscribe('applications');
Meteor.subscribe('industries');


Template.profile.helpers({
	user: function(){
		return Applications.findOne({user: Session.get('userId')});
	},
	displayname: function() {
		return this.name.first + " " + this.name.last;
	},
	college: function() {
		return Colleges.findOne({slug: this.college}).name;
	},
	getIndustryName: function(slug) {
		var industry = _.find(Industries.find().fetch(),
			function(ind){
				return ind.slug === slug;
		});

		return industry.name;
	}
});

Template.profile.colleges = function() {
	return Colleges.find();
}