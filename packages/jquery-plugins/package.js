Package.describe({
	summary: "Load jQuery plugins."
});

Package.on_use(function(api) {
	// simply countable
	api.add_files(['../../public/bower_components/jquery-simply-countable/jquery.simplyCountable.js'], 'client');
});
