Meteor.subscribe('appData');
Meteor.subscribe('information');

var _getName = function (category, value) {
	if (Information.find({category: category}).count() === 0) {
		return;
	}
	return getName(Information.find({category: category}).fetch()[0].values, value);
};

Template.profile.helpers({
	displayname: function () {
		if (this.profile && this.profile.name) {
			return this.profile.name.first + ' ' + this.profile.name.last;
		}
	},
	email: function () {
		return this.emails[0].address;
	},
	getName: _getName,
	getValue: function (field, category) {
		var html = '',
			app = currentApp(),
			category = _.isString(category) ? category : field,
			value;
		if (!app) {
			return;
		}
		value = app[field];

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
	getEssay: function (essays, id) {
		if (essays && essays[id]) {
			return nl2br(html_entity_decode(essays[id]));
		}
	},
	getLanguage: function (language, level) {
		var html = '<span class="list-group">';
		_.each(language, function(fluency, lang) {
			if (level === fluency) {
				html += '<span class="list-item">' + _getName('language', lang) + '</span>';
			}
		});
		html += '</span>';
		return html;
	}
});

Template.profile.rendered = function () {
	this.sections = getInfo('apply-sections');
}

Template.profile.events = {
	'click .edit-app': function(e) {
		e.preventDefault();
		Router.go('/apply');
	}
}

Template.profile.files = function(){
	var files = this.files;
	if (!files) return;
	return [
		{
			label: 'resume',
			field: 'resume',
			file: files['resume']
		},
		{
			label: 'cover letter',
			field: 'cover-letter',
			file: files['cover-letter']
		},
		{
			label: 'transcript',
			field: 'transcript',
			file: files['transcript']
		},
		{
			label: 'writing sample',
			field: 'writing-sample',
			file: files['writing-sample']
		}
	];
}

Template.profile.essays = function () {
	return _.filter(getInfo('apply-sections'), function (sect) {
		return sect.type === 'essay';
	});
}