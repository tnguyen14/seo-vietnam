Meteor.subscribe('colleges');
Meteor.subscribe('majors');
Meteor.subscribe('languages');

var structure = [
	{
		index: 1,
		name: 'personal-info'
	}, {
		index: 2,
		name: 'education'
	}, {
		index: 3,
		name: 'qualifications'
	}, {
		index: 4,
		name: 'professional'
	}, {
		index: 5,
		name: 'passion'
	}, {
		index: 6,
		name: 'community'
	}, {
		index: 7,
		name: 'leadership'
	}
];

Template.apply.fragments = function() {
	return structure;
}

var getCurrentHash = function() {
	var hash = window.location.hash.split('#')[1];
	hash = (hash) ? hash : 'personal-info';
	return hash;
}
var getIndex = function(el, array) {
	var i = -1;
	array.forEach(function(element, index) {
		if (el === element.name) {
			i = index;
		}
	});
	return i;
}

var navigate = function() {
	var to = getCurrentHash();
	// add active class
	$(".pagination li")
		.removeClass('active')
		.each(function(){
			var name = $(this).data('name');
			if (name === to) {
				$(this).addClass('active');
			}
		});

	$(".fragment").removeClass('current prev next');
	// iterate through structure to find index
	var toIndex = getIndex(to, structure),
		prevDisabled = (toIndex === 0) ? 'disabled' : false;
	$('.prev-fragment').attr('disabled', prevDisabled);

	structure.forEach(function(element, index) {
		var $el = $("#" + element.name);
		if (index > toIndex) {
			$el.addClass('next');
		} else if (index < toIndex) {
			$el.addClass('prev');
		} else {
			$el.addClass('current');
		}
	});
}

Template.apply.rendered = function() {
	// reset
	$('.fragment').removeClass('current prev next');
	$('.prev-fragment, .next-fragment').show();

	navigate();
	if ("onhashchange" in window) {
		window.onhashchange = navigate;
	}
}

Template.apply.events = {
	'click .prev-fragment': function(e) {
		e.preventDefault();
		var current = getCurrentHash(),
			currentIndex = getIndex(current, structure),
			prev = structure[currentIndex-1].name;
		window.location.hash = prev;
	},
	'click .next-fragment': function(e) {
		e.preventDefault();
		var current = getCurrentHash(),
			currentIndex = getIndex(current, structure);

		if (currentIndex + 1 < structure.length) {
			var next = structure[currentIndex+1].name;
			window.location.hash = next;
		// completed!
		} else {
			Meteor.Router.to('/completed');
		}
	},
}

Template.education.colleges = function() {
	return Colleges.find();
}

Template.education.majors = function() {
	return Majors.find();
}

Template.qualifications.languages = function() {
	return Languages.find();
}