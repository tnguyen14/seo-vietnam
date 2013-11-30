readFile = function(file) {
	var fileReader = new FileReader(),
		maxSize = 4194304; // 4MB

	fileReader.onload = function() {
		Meteor.call('saveFile', fileReader.result, file.name, file.type);
	}

	// @TODO check for file types again here
	if (file.size >= maxSize) {
		// @TODO add error handling for file that is too large
		return;
	}

	fileReader.readAsBinaryString(file);
}