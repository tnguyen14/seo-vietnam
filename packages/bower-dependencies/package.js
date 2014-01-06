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
	api.add_files([
		'../../public/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
		'../../public/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
		'../../public/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
		'../../public/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'
	], 'client');
	// ladda-bootstrap
	api.add_files([
		'../../public/bower_components/ladda-bootstrap/dist/ladda-themeless.min.css',
		'../../public/bower_components/ladda-bootstrap/dist/spin.min.js',
		'../../public/bower_components/ladda-bootstrap/dist/ladda.min.js'
	], 'client');
	// jquery cookie
	api.add_files([
		'../../public/bower_components/jquery.cookie/jquery.cookie.js'
	], 'client');

	// modernizer
	api.add_files([
		'../../public/bower_components/modernizr/modernizr.js'
	], 'client');

	// moment
	api.add_files([
		'../../public/bower_components/moment/moment.js'
	], 'client');

	// listjs
	api.add_files([
		'../../public/bower_components/listjs/dist/list.js',
		'../../public/bower_components/list.pagination.js/dist/list.pagination.js'
	], 'client');

	// lazy.js
	api.add_files([
		'../../public/bower_components/lazy.js/lazy.js'
	], 'client');
});
