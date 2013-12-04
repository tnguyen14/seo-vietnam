Meteor.subscribe('applications');

var applySections = [
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
	}, {
		index: 8,
		name: 'resume'
	}
];

$.validator.setDefaults({
	errorClass: 'error-label control-label',
	highlight: function(element, errorClass, validClass) {
		$(element).parent('.field-group').removeClass('has-success').addClass('has-error');
	},
	unhighlight: function(element, errorClass, validClass) {
		$(element).parent('.field-group').removeClass('has-error').addClass('has-success');
	}
});
$.validator.addMethod("maxWord", function(value, element, params) {
	return this.optional(element) || $.trim(value).split(/\s+/).length <= params;
}, 'Word limit exceeded.');

var getIndex = function(el) {
	var i = -1;
	applySections.forEach(function(element, index) {
		if (el === element.name) {
			i = index;
		}
	});
	return i;
}

var navigate = function() {
	var to = Session.get('applySection');
	if (!to) {
		to = "personal-info";
		Session.set('applySection', to);
	}

	// add active class
	$(".pagination li")
		.removeClass('active')
		.each(function(){
			var name = $(this).data('name');
			if (name === to) {
				$(this).addClass('active');
			}
		});

	// selectively hide fragment controls for first and last fragments
	$(".fragment-control").removeClass('hidden');
	var toIndex = getIndex(to);
	if (toIndex === 0) {
		$(".fragment-control.prev").addClass('hidden');
	} else if (toIndex === applySections.length - 1) {
		$(".fragment-control.next").addClass('hidden');
	}
}

// Rendered
Template.apply.rendered = function() {
	if (!Meteor.user()) {
		Meteor.Router.to('/login');
	}
	navigate();

	// initiate current app
	currentApp();

	// essay counter
	$('.essay').each(function() {
		$(this).find('textarea').simplyCountable({
			counter: $('.counter', this),
			countType: 'words',
			maxCount: 500
		});
	});

	var $submitButton = $('#app-submit');
	if (Session.get('applySection') === 'resume') {
		$submitButton.removeClass('hidden');
		if (appReady()) {
			$submitButton.removeClass('disabled');
		} else {
			$submitButton.addClass('disabled');
		}
	} else {
		$submitButton.addClass('hidden');
	}
};

//Template Events
Template.apply.events = {
	'click .fragment-control.prev .glyphicon': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current),
			prev = (currentIndex === 0) ? current : applySections[currentIndex-1].name;

		saveInputs();

		// navigate away!
		Meteor.Router.to('/apply/' + prev);
	},
	'click .fragment-control.next .glyphicon': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current),
			next = applySections[currentIndex+1].name;

		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}
		saveInputs();

		Meteor.Router.to('/apply/' + next);
	},
	'click .pagination li': function(e) {
		e.preventDefault();
		// `this` is the context of of these li's
		var current = Session.get('applySection'),
			to = this.name;

		// if form validation failes, don't do anything
		if (!$('#' + current).valid()) {
			return;
		}

		saveInputs();

		// Session.set('applySection', to);
		Meteor.Router.to('/apply/' + to);
		navigate();
	},
	'click #logout': function(e) {
		e.preventDefault();
		Meteor.logout(function(err) {
			if (err) {
				console.log(err);
			} else {
				Meteor.Router.to('/');
			}
		});
	},
	'click #app-save': function(e) {
		e.preventDefault();
		var current = Session.get('applySection');

		if (!$('#' + current).valid()) {
			return;
		}

		saveInputs();
		notify('The application is saved successfully.', 'success', true, true);
	},
	// add own content
	'click .add-own-content .add': function(e) {
		e.preventDefault();
		$(e.target).closest('.add-own-content').find('.add-content-wrap').toggleClass('hidden');
	}
};

// Template Variables

Template.apply.fragments = function() {
	return applySections;
}

Template.apply.currentSection = function() {
	if (Session.get('applySection')) {
		return Session.get('applySection');
	} else {
		return applySections[0].name;
	}
}

Template.apply.app = function() {
	return currentApp();
}