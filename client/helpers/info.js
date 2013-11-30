// Get stuff back from the Information database,
// based on the category
// Only return stuff that has been verified or added by the current user
// @return array an empty object if nothing is found
getInfo = function (category) {
	var cursor = Information.find({
		category: category
	});
	if (cursor.count() > 0) {
		return _.filter(cursor.fetch()[0].values, function(doc){
			return doc['verified'] === true || doc['addedBy'] === Meteor.userId();
		});
	} else {
		// return an empty object
		return cursor.fetch();
	}
}