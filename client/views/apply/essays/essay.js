Template['essay-one'].section = function () {
	return Session.get('currentSection');
}

Template['essay-two'].section = function () {
	return Session.get('currentSection');
}

Template['essay-three'].section = function () {
	return Session.get('currentSection');
}

Template['essay-four'].section = function () {
	return Session.get('currentSection');
}

Template['essay-five'].section = function () {
	return Session.get('currentSection');
}

Handlebars.registerHelper('getEssay', function(essays, id) {
	return essays[id];
});