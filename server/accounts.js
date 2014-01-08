Accounts.onCreateUser(function (options, user) {

	// example user object
	// {
	//   createdAt: Sat Oct 12 2013 15:16:16 GMT-0400 (EDT),
	//   _id: '7rgg29b3NCm5oCfxA',
	//   services:
	//   { password: { srp: [Object] },
	//     resume: { loginTokens: [Object] }
	//   },
	//   emails: [ { address: 'tringuyenduy@gmail.com', verified: false } ]
	// }

	// initiate an empty profile object
	if (!user.profile) user.profile = {};

	// add roles
	user.roles = [];
	if (options.profile.roles && options.profile.roles.length > 0) {
		_.each(options.profile.roles, function(role) {
			user.roles.push(role);
		})
	}
	return user;
});

var checkGraderSecret = function(secret) {
	var grade_secret = process.env.GRADE_SECRET || Meteor.settings.grade_secret;
	if (grade_secret === '' || grade_secret === undefined) {
		throw new Meteor.Error(500, 'Cannot register grader right now. Please try again later.', 'No grade secret set.');
	}
	if (secret.toLowerCase() !== grade_secret) {
		throw new Meteor.Error(401, 'Incorrect secret key.');
	}
	return true;
}

Meteor.users.allow({
	update: function() {
		return true;
	}
});

Meteor.methods({
	'checkGraderSecret': checkGraderSecret
})