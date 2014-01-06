// Get stuff back from the Information database,
// based on the category
// Only return stuff that has been verified or added by the current user
// @return array an empty object if nothing is found
getInfo = function (category) {
	var cursor = Information.find({
		category: category
	});
	if (cursor.count() > 0) {
		return Lazy(cursor.fetch()[0].values).filter(function(doc){
			return doc['verified'] === true || doc['addedBy'] === Meteor.userId();
		}).toArray();
	} else {
		// return an empty object
		return cursor.fetch();
	}
}