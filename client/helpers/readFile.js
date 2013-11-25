readFile = function(file) {
	var fileReader = new FileReader();

	fileReader.onload = function() {
		Meteor.call('saveFile', fileReader.result, file.name, file.type, file.size);
	}

	fileReader.readAsBinaryString(file);
}