Meteor.subscribe('colleges');
Meteor.subscribe('majors');
Meteor.subscribe('languages');

Template.education.helpers({
	debug: function(arg) {
		console.log(arg);
	}
});

Template.education.colleges = function() {
	return Colleges.find();
}

Template.education.majors = function() {
	return Majors.find();
}

Template.qualifications.languages = function() {
	return Languages.find();
}

Template['personal-info'].events = {
	'click .next-fragment': function(e) {
		navigate(e, 'education', true);
	},
}

Template.education.events = {
	'click .next-fragment': function(e) {
		navigate(e, 'qualifications', true);
	},
	'click .prev-fragment': function(e) {
		navigate(e, 'personal-info', false);
	}
}

Template.qualifications.events = {
	'click .next-fragment': function(e) {
		navigate(e, 'professional', true);
	},
	'click .prev-fragment': function(e) {
		navigate(e, 'education', false);
	}
}
Template.professional.events = {
	'click .next-fragment': function(e) {
		navigate(e, 'essay-passion', true);
	},
	'click .prev-fragment': function(e) {
		navigate(e, 'qualifications', false);
	}
}
Template['essay-passion'].events = {
	'click .next-fragment': function(e) {
		navigate(e, 'essay-community', true);
	},
	'click .prev-fragment': function(e) {
		navigate(e, 'professional', false);
	}
}
Template['essay-community'].events = {
	'click .next-fragment': function(e) {
		navigate(e, 'essay-leadership', true);
	},
	'click .prev-fragment': function(e) {
		navigate(e, 'essay-passion', false);
	}
}
Template['essay-leadership'].events = {
	'click .next-fragment': function(e) {
		navigate(e, 'completed', true);
	},
	'click .prev-fragment': function(e) {
		navigate(e, 'essay-community', false);
	}
}
Template.completed.events = {
	'click .review': function(e) {
		e.preventDefault();
	}
}

var navigate = function(event, dest, forward) {
	event.preventDefault();
	var button = event.currentTarget,
		$currentEl = $(button).closest('form');
		destClass = (forward) ? 'next' : 'prev',
		currentClass = (forward) ? 'prev' : 'next';

	$currentEl.removeClass('current').addClass(currentClass);
	$('#' + dest).removeClass(destClass).addClass('current');
}