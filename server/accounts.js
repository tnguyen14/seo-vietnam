Accounts.onCreateUser(function (options, user) {
	console.log(options);
	console.log(user);
	// initiate an empty profile object
	user.profile = {};
	return user;
});