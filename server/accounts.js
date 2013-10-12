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
	console.log(options);
	console.log(user);
	// initiate an empty profile object
	user.profile = {};

	// add roles
	user.roles = [];
	if (options.profile.roles && options.profile.roles.length > 0) {
		_.each(options.profile.roles, function(role) {
			user.roles.push(role);
		})
	}

	return user;
});