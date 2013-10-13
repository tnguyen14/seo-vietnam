Meteor.startup(function () {
	// start with some dummy colleges
	if (Information.find({category: 'college'}).count() === 0) {
		Information.insert({
			category: 'college',
			values: [
				{
					name: "Wheaton College",
					slug: "wheatonma"
				},
				{
					name: "New York University",
					slug: "nyu"
				},
				{
					name: "Stonehill College",
					slug: "stonehill"
				}
			]
		});
	}

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