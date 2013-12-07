Template['file-upload'].events = {
	'click .file-submit': function(e) {
		e.preventDefault();
		var $form = $(e.target).closest('.file-upload');
			$fileInput = $form.find(':file'),
			file = $fileInput[0],
			field = $fileInput.data('field'),
			ladda = Ladda.create(e.target);

		if (file.files[0]) {
			ladda.start();
			readFile(file.files[0], field);
		}
	}
}

Template['file-upload'].rendered = function(){

}