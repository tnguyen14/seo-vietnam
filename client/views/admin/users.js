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
		return {
			users: users,
		};
	}
});

Template['admin-users'].rendered = function() {
	var $table = $('#admin-users .admin-list-users');
	$table.dataTable();
}

AdminUserSingle = RouteController.extend({
	layoutTemplate: 'admin-layout',
	template: 'admin-user-single',
	waitOn: function() {
		return Meteor.subscribe('userData', this.params._id);
	},
	data: function() {
		var roles = ['applicant', 'admin', 'grader'];
		return {
			user: Meteor.users.findOne(this.params._id),
			roles: roles
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
	}
}