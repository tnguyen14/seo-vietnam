Meteor.subscribe('app');
Meteor.subscribe('information');

var _getName = function (category, value) {
	var count = Information.find({category: category}).count();
	if (!value) {
		return;
	}
	if (count === 0) {
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
	graduateYear: function(year) {
		return year.substr(-2);
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
		return nl2br(html_entity_decode(essays[id]));
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
	},
	checkFile: function(field) {
		console.log(this);
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