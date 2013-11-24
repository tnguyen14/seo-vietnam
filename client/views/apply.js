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

Template.apply.fragments = function() {
	return applySections;
}

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

// Check whether application is ready for submit
var appReady = function(){
	var required = [
			'college',
			'major',
			'essay-community',
			'essay-leadership',
			'essay-passion'
		],
		app = currentApp(),
		empty = [];
	_.each(required, function(field){
		if (!app[field]) {
			empty.push(field);
		}
	});

	if (empty.length) {
		console.log('app is incomplete');
		console.log(empty);
		return false;
	} else {
		console.log('app is complete');
		return true;
	}
};

// Add notifications
// valid context: success, info, warning, danger
var notify = function(message, context, dismissable, auto) {
	if (!message) {
		return ;
	}
	var html = '<div class="alert ';
	if (_.contains(['success', 'info', 'warning', 'danger'], context)) {
		html += 'alert-' + context;
	}
	html += '"">';

	if (dismissable) {
		html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
	}

	html += message + '</div>';

	var $notification = $(html).appendTo('.notifications');

	if (auto) {
		setTimeout(function() {
			$notification.fadeOut(1000, function(){
				$(this).remove();
			});
		}, 3000);
		return;
	} else {
		return $notification;
	}
}

// Clear all notifications of a particular class
// default to '.alert'
// accepted type: success, info, warning, danger
var clearNotifications = function(type) {
	var alerts = '.alert';
	if (_.contains(['success', 'info', 'warning', 'danger'], type)) {
		alerts += '-' + type;
	}
	$('.notifications').find(alerts).remove();
}

// Rendered
Template.apply.rendered = function() {
	if (!Meteor.user()) {
		Meteor.Router.to('/login');
	}
	navigate();

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
	},
	'click .add-content-button': function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $wrap = $(e.target).closest('.add-content-wrap');
			$input = $('input', $wrap),
			value = $input.val().trim(),
			category = $input.data('category'),
			newInfo = {
				name: html_entity_encode(value),
				slug: slugify(value),
				addedBy: Meteor.userId(),
				verified: false
			};

		// quit if nothing is entered
		if (value === '') {
			return;
		}

		Meteor.call('addInfo', category, newInfo, function(err, added) {
			if (err) {
				notify(err.reason, 'danger', true);
			} else {
				if (added) {
					$input.val('');
					clearNotifications('danger');
					notify('Successfully added your option.', 'success', true);
				}
			}
		});
	}
};

// Template Variables
Template.apply.currentSection = function() {
	if (Session.get('applySection')) {
		return Session.get('applySection');
	} else {
		return applySections[0].name;
	}
}
Template.apply.app = function() {
	var app;
	try {
		app = currentApp();
	} catch (e) {
		console.log(e);
		$('.form-container').append('<label class="error-label>' + e.reason + '</label>');
	}
	return app;
}