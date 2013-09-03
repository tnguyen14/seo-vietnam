// Save inputs

collectInputs = function(ctx) {
	var field = {};
	$('input[type="text"], input[type="number"], input[type="email"], textarea, select', ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val();
		field[name] = value;
	});

	// checkboxes are saved as array of values
	$('input[type="checkbox"]:checked', ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val();
		field[name] = field[name] || [];
		field[name].push(value);
	});

	$('input[type="file"]', ctx).each(function(){
		var name = $(this).attr('name'),
			value = {};
		value.url = $(this).data('url');
		value.key = $(this).data('awskey');
		field[name] = value;
	})

	return field;
};

saveFormGroups = function(ctx, collection, _id, cb) {
	$('.form-group', $(ctx)).each(function() {
		var group = {},
			field = collectInputs(this),
			name = $(this).attr('name');
		if (name) {
			group[name] = field;
		} else {
			group = field;
		}
		collection.update(_id, {$set: group}, cb);
	});
};

saveInputs = function(cb) {
	var current = Session.get('applySection'),
		userId = Session.get("userId"),
		appId = Applications.findOne({'user': userId})._id;


	// save personal info to User
	if (current === 'personal-info') {
		saveFormGroups('#' + current, FakeUsers, userId, cb);
		return;
	}

	saveFormGroups('#' + current, Applications, appId, cb);
}