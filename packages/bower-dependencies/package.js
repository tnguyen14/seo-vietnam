Package.describe({
	summary: "Load bower dependencies."
});

Package.on_use(function(api) {
	// simply countable
	api.add_files(['../../public/bower_components/jquery-simply-countable/jquery.simplyCountable.js'], 'client');
	// jquery validate
	api.add_files(['../../public/bower_components/jquery.validation/jquery.validate.js'], 'client');
	api.add_files(['../../public/bower_components/jquery.validation/additional-methods.js'], 'client');
	// bootstrap
	api.add_files(['../../public/bower_components/bootstrap/dist/js/bootstrap.min.js'], 'client');
	// ladda-bootstrap
	api.add_files([
		'../../public/bower_components/ladda-bootstrap/dist/ladda-themeless.min.css',
		'../../public/bower_components/ladda-bootstrap/dist/spin.min.js',
		'../../public/bower_components/ladda-bootstrap/dist/ladda.min.js'
	], 'client');
});
