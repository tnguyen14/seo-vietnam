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
		return this.profile.name.first + ' ' + this.profile.name.last;
	},
	email: function () {
		return this.emails[0].address;
	},
	app: function () {
		return Applications.findOne({user: Meteor.userId()});
	},
	getName: _getName,
	getValue: function (field, category) {
		var html = '',
			value = currentApp()[field],
			category = _.isString(category) ? category : field;
		if (_.isArray(value)) {
			html += '<span class="list-group">';
			_.each(value, function(val) {
				html+= '<span class="list-item">' + _getName(category, val) + '</span>';
			});
			html += '</span>'
		} else {
			// default category to field name
			html = _getName(category, value);
		}
		return html;
	},
	getLanguage: function (language, level) {
		var html = '<span class="list-group">';
		_.each(language, function(fluency, lang) {
			if (_.contains(fluency, level)) {
				html += '<span class="list-item">' + _getName('language', lang) + '</span>';
			}
		});
		html += '</span>';
		return html;
	}
});

Template.profile.events = {
	'click #edit-app': function(e) {
		e.preventDefault();
		Meteor.Router.to('/apply');
	}
}