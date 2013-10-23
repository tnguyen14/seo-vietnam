// get stuff back from the Information database,
// based on the category
// return an empty object if nothing is found

getInfo = function (category) {
	var cursor = Information.find({category: category});
	if (cursor.count() > 0) {
		return cursor.fetch()[0].values;
	} else {
		// return an empty object
		return cursor.fetch();
	}
}