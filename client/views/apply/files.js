Template.files.events = {
	'click .remove-file': function(e) {
		e.preventDefault();
		var app = currentApp();
			field = $(e.target).data('field'),
			set = {};
		set['files.' + field] = {};
		if (app) {
			Applications.update(app._id, {$set: set});
		}
	},
	'click .reupload': function(e) {
		e.preventDefault();
		var data = this;
		var resumeUpload = Meteor.render(function(){
			return Template['file-upload'](data);
		});
		$(e.target).closest('.file-uploaded').append(resumeUpload);
	}
}

Template.files.uploads = function(){
	var files = this.files || {};
	return [
		{
			label: 'resume',
			field: 'resume',
			file: files['resume']
		},
		{
			label: 'cover letter',
			field: 'cover-letter',
			optional: true,
			file: files['cover-letter']
		},
		{
			label: 'transcript',
			field: 'transcript',
			optional: true,
			file: files['transcript']
		},
		{
			label: 'writing sample',
			field: 'writing-sample',
			optional: true,
			file: files['writing-sample']
		}
	];
}

Template.files.rendered = function(){
}