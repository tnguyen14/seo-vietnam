readFile = function(file) {
	var fileReader = new FileReader(),
		maxSize = 4194304, // 4MB
		ext = file.name.split('.').pop(),
		timestamp = new Date().getTime().toString().substr(-8),
		user = Meteor.user(),
		fileName;

	// Build filename
	// firstName-lastName-resume-timestamp.ext
	fileName = user.profile.name.first + '-' + user.profile.name.last + '-resume-' + timestamp + '.' + ext;

	fileReader.onload = function() {
		Meteor.call('saveFile', fileReader.result, fileName, file.type);
	}

	// @TODO check for file types again here
	if (file.size > maxSize) {
		notify('Your file size must be 4MB or less.', 'warning', true);
		return;
	}

	fileReader.readAsBinaryString(file);
}