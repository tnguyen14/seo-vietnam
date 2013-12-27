readFile = function(file, field) {
	var fileReader = new FileReader(),
		maxSize = 4194304, // 4MB
		ext = file.name.split('.').pop(),
		timestamp = new Date().getTime().toString().substr(-8),
		user = Meteor.user(),
		userName = user.profile.name.first + '-' + user.profile.name.last,
		userStamp = user._id.substr(-4),
		folderName = userName + '-' + userStamp,
		fileName;

	// Build filename
	// firstName-lastName-resume-timestamp.ext
	fileName = userName + '-' + field + '-' + timestamp + '.' + ext;

	fileReader.onload = function() {
		Meteor.call('saveFile', fileReader.result, fileName, folderName, field);
	}

	// @TODO check for file types again here
	if (file.size > maxSize) {
		notify({message: 'Your file size must be 4MB or less.'});
		return;
	}

	fileReader.readAsBinaryString(file);
}