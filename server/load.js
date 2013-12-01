// Add a document to the Information collection
// @param category (string): name of the category for the doc to be inserted
// @param doc (object): the new document to be inserted
var _addInfo = function (category, doc) {
	var currentCursor = Information.find({category: category});
	if ( currentCursor.count() > 0 ) {
		var currentValues = currentCursor.fetch()[0].values;
		// This is a slow way to do it
		_.each(currentValues, function(value) {
			if (doc.slug === value.slug || doc.name === value.name) {
				throw new Meteor.Error(400, "The document '" + doc.name + "' already exists.");
				return false;
			}
		});
	}

	Information.update(
		{ category: category },
		{ $addToSet: { values: doc } },
		{ upsert: true }
	);
	return true;
}

// Load default information from JSON file into the Information collection

var _loadDefault = function(category) {
	var data = JSON.parse(Assets.getText(category + '.json')).values;
	_.each(data, function(d) {
		// automatically generate slug
		if (!d.slug) {
			d.slug = slugify(d.name);
		}
		// add default userId and verify
		_.extend(d, {addedBy: 0, verified: true});

		// attempt to add document into Information collection
		try {
			_addInfo(category, d);
		} catch (e) {
			// console.log(e.message);
		}
	});
}

Meteor.methods({
	'addInfo': _addInfo
});

Meteor.startup(function () {
	// load default information
	[
		'college',
		'major',
		'profession',
		'industry',
		'language',
		'country'
	].map(_loadDefault);

});