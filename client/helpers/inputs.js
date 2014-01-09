// Save inputs

collectInputs = function(ctx) {
	var field = {};

	$(['input[type="text"]',
		'input[type="number"]',
		'input[type="email"]',
		'input[type="tel"]',
		'textarea',
		'select',
		'input[type="radio"]:checked'
	].join(', '), ctx).each(function(){
		var name = $(this).attr('name'),
			value = $(this).val().trim();
		value = html_entity_encode(value);
		// convert to array if name already exists
		if (field[name]) {
			if (! _.isArray(field[name])){
				field[name] = [field[name]];
			}
			field[name].push(value);
		} else {
			field[name] = value;
		}
	});

	// checkboxes are saved as array of values
	$('input[type="checkbox"]', ctx).each(function(){
		var name = $(this).attr('name'),
			value;
		if (this.checked) {
			value = $(this).val();
			value = html_entity_encode(value);
		}
		field[name] = field[name] || [];
		if (value) {
			field[name].push(value);
		}
	});
	return field;
};

save = function(options) {
	// throw tantrums if options are not declared properly
	if (!_.isObject(options)) {
		throw new Meteor.Error(400, 'No options specified.');
	}
	if (!options.groups || !_.isArray(options.groups)) {
		throw new Meteor.Error(400, 'Save needs an array of groups to save');
	}
	if (!options.collection) {
		throw new Meteor.Error(400, 'No collection specified');
	}
	if (!options.id) {
		throw new Meteor.Error(400, 'No object ID specified');
	}

	// map inputGroups elements to function to save them to collection
	// use jQuery promise to apply doneCb when all groups have been saved
	$.when.apply($, $.map(options.groups, function(group) {
		var dfd = new jQuery.Deferred();
		options.collection.update(options.id, {$set: group}, function(err, res) {
			// if there's no error, result is the number of documents affected
			if (err) {
				dfd.reject(err);
			} else {
				dfd.resolve();
			}
		});
		return dfd.promise();
	})).done(function() {
		if (options.success) options.success();
	}).fail(function(err) {
		if (options.error) options.error(err);
	});
}

saveUser = function(options) {
	var defaultOptions = {
		collection: Meteor.users,
		id: Meteor.userId(),
		groups: []
	};
	if (_.isObject(options)) {
		options = _.extend(defaultOptions, options);
	}
	save(options);
}

saveApp = function(options) {
	var defaultOptions = {
		collection: Applications,
		id: currentApp()._id,
		groups: []
	};
	if (_.isObject(options)) {
		options = _.extend(defaultOptions, options);
	}
	save(options);
}

getFormGroups = function(ctx) {
	var inputGroups = [];
	// collect inputs in groups and save them to array
	$('.form-group', ctx).each(function () {
		var group = {},
			field = collectInputs(this),
			name = $(this).attr('name');
		if (name) {
			group[name] = field;
		} else {
			group = field;
		}
		inputGroups.push(group);
	});
	return inputGroups;
}
