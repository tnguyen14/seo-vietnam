Meteor.subscribe('applications');
Meteor.subscribe('industries');
Meteor.subscribe('majors');
Meteor.subscribe('languages');
Meteor.subscribe('functions');

// get name from slug
var getName = function(slug, collection) {
	var doc = _.find(collection.find().fetch(),
		function(d){
			return d.slug === slug;
		});
	return doc.name;
};

Template.profile.helpers({
	displayname: function() {
		return this.profile.name.first + " " + this.profile.name.last;
	},
	email: function() {
		return this.emails[0].address;
	},
	app: function() {
		return Applications.findOne({user: Meteor.userId()});
	},
	college: function() {
		return Colleges.findOne({slug: this.college}).name;
	},
	getIndustryName: function(slug) {
		return getName(slug, Industries);
	},
	getFunctionName: function(slug) {
		return getName(slug, Functions);
	},
	getMajorName: function(slug) {
		return getName(slug, Majors)
	},
	displayLanguage: function(proficiency) {
		var html = '';
		for (var lang in proficiency) {
			if (proficiency.hasOwnProperty(lang)) {
				// only display language with some proficiency
				if (proficiency[lang] !== 'none') {
					html += '<label for="' + lang + '">' + getName(lang, Languages) + '</label>';
					html += proficiency[lang];
				}
			}
		}
		return html;
	}
});

Template.profile.events = {
	'click #edit-app': function(e) {
		e.preventDefault();
		Meteor.Router.to('/apply');
	}
}