var s3 = Meteor.require('s3'),
	fs = Npm.require('fs'),
	s3settings = {
		key: process.env.S3_KEY || Meteor.settings.aws.s3key,
		secret: process.env.S3_SECRET || Meteor.settings.aws.s3secret,
		bucket: process.env.S3_BUCKET || Meteor.settings.aws.s3bucket
	},
	client = s3.createClient(s3settings);

var uploadFile = function(localFile, uploadFolder, cb) {
	var headers = {
		'x-amz-acl' : 'public-read'
	}
	var uploader = client.upload(localFile, 'user-uploads/' + uploadFolder + '/' + localFile, headers);
	uploader.on('error', function(err) {
		console.error("unable to upload:", err.stack);
		cb(new Meteor.Error(400, 'Unable to upload: ' + err.stack));
	});
	uploader.on('progress', function(amountDone, amountTotal) {
		// console.log("progress", amountDone, amountTotal);
	});
	uploader.on('end', function(url) {
		console.log("file available at", url);
		cb(null, url);
	});
// remove file after uploaded?
}

var saveFile = function(blob, name, folder, field) {
	var uploadFileSync = Meteor._wrapAsync(uploadFile),
		s3Url;
	fs.writeFileSync(name, blob, {encoding: 'binary'});
	s3Url = uploadFileSync(name, folder);
	if (s3Url) {
		var set = {};
		set['files.' + field] = {
			name: name,
			url: s3Url
		}
		Applications.update({'user': this.userId}, {
			$set: set
		});
	}
}

Meteor.methods({
	'saveFile': saveFile
});