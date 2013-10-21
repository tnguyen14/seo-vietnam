Meteor.subscribe('applications');
Meteor.subscribe('information');

var _getName = function (category, value) {
	if (!value) {
		return;
	}
	var doc = _.find(Information.find({category: category}).fetch()[0].values,
		function(d){
			return d.slug === value;
		});
	if (doc) {
		return doc.name;
	}
};

Template.profile.helpers({
	displayname: function () {
		return this.profile.name.first + " " + this.profile.name.last;
	},
	email: function () {
		return this.emails[0].address;
	},
	app: function () {
		return Applications.findOne({user: Meteor.userId()});
	},
	getName: _getName,
	getLanguage: function (language, level) {
		var html = '';
		_.each(language, function(fluency, lang) {
			if (_.contains(fluency, level)) {
				html += '<li>' + _getName('language', lang) + '</li>';
			}
		});
		return html;
	}
});

Template.profile.events = {
	'click #edit-app': function(e) {
		e.preventDefault();
		Meteor.Router.to('/apply');
	}
}