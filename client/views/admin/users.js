AdminUsersController = RouteController.extend({
	layoutTemplate: 'admin-layout',
	template: 'admin-users',
	waitOn: function() {
		return [
			Meteor.subscribe('allApps'),
			Meteor.subscribe('allUsers')
		];
	},
	data: function() {
		var users = Meteor.users.find().fetch();
		Lazy(users).each(function(u) {
			var app = Applications.findOne({user: u._id});
			if (app) {
				u._appId = app._id;
			}
			u.profileURL = Router.routes['admin-user-single'].path({_id: u._id});
		});
		return {
			users: users,
		};
	}
});

Template['admin-users'].rendered = function() {
	// var $table = $('#admin-users .admin-list-users');
	// $table.dataTable();
	var listOptions = {
		valueNames: [
			'name',
			'email',
			'status',
			'date-joined',
			'roles',
			'app'
		],
		page: 20,
		// indexAsync: true,
		plugins: [
			ListPagination({
				outerWindow: 2
			})
		]
	}
	var userList = new List('admin-users', listOptions);
	userList.on('updated', function(){
		 $('table thead').toggle(userList.matchingItems.length !== 0);
		});
}

AdminUserSingle = RouteController.extend({
	layoutTemplate: 'admin-layout',
	template: 'admin-user-single',
	waitOn: function() {
		return [
			Meteor.subscribe('userData', this.params._id),
			Meteor.subscribe('appData', this.params._id)
		];
	},
	data: function() {
		var roles = ['applicant', 'admin', 'grader'],
			app = Applications.findOne({user: this.params._id});
		app._appId = app._id;
		return {
			user: Meteor.users.findOne(this.params._id),
			roles: roles,
			app: app
		};
	}
});

Template['admin-user-single'].helpers({
	'roles-check': function(role, userRoles) {
		if (_.contains(userRoles, role)) {
			return 'checked';
		}
	}
});

Template['admin-user-single'].rendered = function() {
	$('#admin-edit-user').validate({
	});
}

Template['admin-user-single'].events = {
	'click #user-save': function(e) {
		e.preventDefault();
		var $form = $('#admin-edit-user'),
			userId = $form.data('id');
		if ($form.valid()) {
			$form.find('.form-group').each(function() {
				var field = collectInputs(this);
				Meteor.users.update(userId, {$set: field}, function(err, res){
				});
			});
		}
	},
	'click #create-new-app': function(e) {
		e.preventDefault();
		var userId = $('#admin-edit-user').data('id');
		newApplication(userId, function(err, appId) {
			if (err) {
				console.log(err);
			} else {
				console.log('successfully created new app ' + appId);
			}
		});
	}
}