Meteor.subscribe('appData');
Meteor.subscribe('information');

Template.profile.events = {
	'click .edit-app': function(e) {
		e.preventDefault();
		Router.go('/apply');
	}
}

Template['display-files'].files = function(){
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

Template['display-qualifications'].helpers({
	getLanguage: function (language, level) {
		var html = '<span class="list-group">';
		_.each(language, function(fluency, lang) {
			if (level === fluency) {
				html += '<span class="list-item">' + getInfoName('language', lang) + '</span>';
			}
		});
		html += '</span>';
		return html;
	}
});

Template['display-essays'].helpers({
	getEssay: function (essays, id) {
		if (essays && essays[id]) {
			return nl2br(html_entity_decode(essays[id]));
		}
	}
});

Template['display-essays'].essays = function () {
	return _.filter(getInfo('apply-sections'), function (sect) {
		return sect.type === 'essay';
	});
}