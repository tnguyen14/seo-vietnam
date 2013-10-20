var _addInfo = function (category, doc, userId) {
	var currentValues = Information.find({category: category}).fetch()[0].values;
	// This is a slow way to do it
	_.each(currentValues, function(value) {
		if (doc.slug === value.slug || doc.name === value.name) {
			throw new Meteor.Error(400, 'This document already exists.');
			return false;
		}
	})
	_.extend(doc, {addedBy: userId});
	Information.update(
		{ category: category },
		{ $addToSet: { values: doc } }
	);
	return true;
}

Meteor.methods({
	'addInfo': _addInfo
});

Meteor.startup(function () {
	var colleges = JSON.parse(Assets.getText('college.json')).values;
	_.each(colleges, function(college) {
		if (!college.slug) {
			college.slug = slugify(college.name);
		}
		try {
			_addInfo('college', college, 0);
		} catch (e) {
			// console.log(e);
		}
	});

	// and some majors too
	if (Information.find({category: 'major'}).count() === 0) {
		Information.insert({
			category: 'major',
			values: [
				{
					name: "Economics",
					slug: "economics"
				},
				{
					name: "Computer Science",
					slug: "computer-science"
				},
				{
					name: "Psychology",
					slug: "psychology"
				}
			]
		});
	}

	if (Information.find({category: 'language'}).count() === 0) {
		Information.insert({
			category: 'language',
			values: [
				{
					name: "Vietnamese",
					slug: "vietnamese"
				},
				{
					name: "English",
					slug: "english"
				},
				{
					name: "French",
					slug: "french"
				}
			]
		});
	}

	if (Information.find({category: 'country'}).count() === 0) {
		Information.insert({
			category: 'country',
			values: [
				{
					name: "Vietnam",
					slug: "vietnam"
				},
				{
					name: "United States",
					slug: "us"
				},
				{
					name: "Singapore",
					slug: "singapore"
				}
			]
		});
	}

	if (Information.find({category: 'industry'}).count() === 0) {
		Information.insert({
			category: 'industry',
			values: [
				{
					name: "Finance",
					slug: "finance"
				},
				{
					name: "Civil Engineering",
					slug: "civil-engineering"
				},
				{
					name: "Computer Engineering",
					slug: "computer-engineering"
				}, {
					name: "Retail",
					slug: "retail"
				}, {
					name: "Non-Profit",
					slug: "nonprofit"
				}
			]
		});
	}

	if (Information.find({category: 'profession'}).count() === 0) {
		Information.insert({
			category: 'profession',
			values: [
				{
					name: "Communication",
					slug: "communication"
				},
				{
					name: "Finance",
					slug: "finance"
				},
				{
					name: "Marketing",
					slug: "marketing"
				}, {
					name: "Operations",
					slug: "operations"
				}, {
					name: "Information Technology",
					slug: "it"
				}
			]
		});
	}

});