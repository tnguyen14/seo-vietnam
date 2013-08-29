Meteor.subscribe('colleges');
Meteor.subscribe('majors');
Meteor.subscribe('languages');
Meteor.subscribe('industries');
Meteor.subscribe('countries');
Meteor.subscribe('fake-users');
Meteor.subscribe('applications');

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
	}, {
		index: 8,
		name: 'resume'
	}
];

Template.apply.fragments = function() {
	return structure;
}

Template.apply.user = function() {
	return Applications.findOne({user: Session.get('userId')});
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

var saveInputs = function() {
	var current = Session.get('applySection'),
		userId = Session.get("userId"),
		name,
		value,
		field = {};

	if (Applications.find({'user': userId}).count() === 0 ){
		Applications.insert({'user': userId});
	}
	var appId = Applications.findOne({'user': userId})._id;

	$('input[type="text"], textarea, select', $('#' + current)).each(function(){
		name = $(this).attr('name');
		value = $(this).val();
		field[name] = value;
	});
	$('input[type="checkbox"]:checked').each(function(){
		name = $(this).attr('name');
		value = $(this).val();
		field[name] = field[name] || [];
		field[name].push(value);
	});
	Applications.update(appId, {$set: field});
}

var navigate = function() {
	var to = Session.get('applySection');
	if (!to) {
		to = "personal-info";
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
	var prevIndex = (toIndex === 0) ? structure.length -1 : toIndex -1,
		nextIndex = (toIndex === structure.length -1) ? 0 : toIndex + 1;
	$("#" + structure[prevIndex].name).addClass('prev');
	$("#" + structure[nextIndex].name).addClass('next');
	$("#" + to).addClass('current');
}

Template.apply.rendered = function() {
	// reset
	navigate();
	// use bootstrap-select
	$('.selectpicker').selectpicker();

	$("#passion textarea").simplyCountable({
		counter: '#passion-counter',
		countType: 'words',
		maxCount: 500
	});
	$("#community textarea").simplyCountable({
		counter: '#community-counter',
		countType: 'words',
		maxCount: 500
	});
	$("#leadership textarea").simplyCountable({
		counter: '#leadership-counter',
		countType: 'words',
		maxCount: 500
	});
};

//Template Events
Template.apply.events = {
	'click .prev-fragment': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current, structure),
			prev = (currentIndex === 0) ? current : structure[currentIndex-1].name;

		saveInputs();

		// navigate away!
		Session.set('applySection', prev);
		Meteor.Router.to('/apply/' + prev);
		navigate();
	},
	'click .next-fragment': function(e) {
		e.preventDefault();
		var current = Session.get('applySection'),
			currentIndex = getIndex(current, structure);

		saveInputs();
		// not yet at the last fragment
		if (currentIndex + 1 < structure.length) {
			var next = structure[currentIndex+1].name;
			Session.get('applySection', next);
			Meteor.Router.to('/apply/' + next);
			navigate();
		// completed!
		} else {
			Meteor.Router.to('/completed');
		}
	},
	'click .pagination li': function(e) {
		// this is the context of of these li's
		var to = this.name;
		Session.set('applySection', to);
		Meteor.Router.to('/apply/' + to);
		navigate();
	}
};

Template.resume.events = {
	'click #resume-submit': function(e) {
		e.preventDefault();
		var fileInput = document.getElementById("file-resume");
		if (!fileInput.value) {
			console.log("Choose a resume to store to S3");
		} else {
			filepicker.store(fileInput, {
				location: 'S3'
			},function(InkBlob){
				console.log("Store successful:", JSON.stringify(InkBlob));
			}, function(FPError) {
				console.log(FPError.toString());
			}, function(progress) {
				console.log("Loading: "+progress+"%");
			});
		}
	}
}
// Template Helpers
Template.education.helpers({
	'selected': function(slug, value) {
		if (slug === value) {
			return 'selected';
		}
	}
});
Template.professional.helpers({
	'checked': function (slug, values) {
		if (_.contains(values, slug)) {
			return 'checked';
		}
	}
});

// Template Variables
Template.education.colleges = function() {
	return Colleges.find();
}

Template.education.majors = function() {
	return Majors.find();
}

Template.qualifications.languages = function() {
	return Languages.find();
}

Template.professional.industries = function() {
	return Industries.find();
}
Template['personal-info'].countries = function() {
	return Countries.find();
}