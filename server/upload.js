var s3 = Meteor.require('s3'),
	fs = Npm.require('fs');

var client = s3.createClient({
	key: 'AKIAJKMWRVLM7K32FPMA',
	secret: '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',
	bucket: 'seo-vietnam'
});

var saveResume = function(fileName, fileUrl, userId) {
	if (!userId) return;
	Applications.update({'user': userId}, {
		$set: {
			'file-resume': {
				name: fileName,
				url: fileUrl
			}
		}
	});
}

var uploadFile = function(localFile, cb) {
	var headers = {
		'x-amz-acl' : 'public-read'
	}
	var uploader = client.upload(localFile, 'resume-uploads/' + localFile, headers);
	uploader.on('error', function(err) {
		console.error("unable to upload:", err.stack);
		cb(new Meteor.Error(400, 'Unable to upload: ' + err.stack));
	});
	uploader.on('progress', function(amountDone, amountTotal) {
		console.log("progress", amountDone, amountTotal);
	});
	uploader.on('end', function(url) {
		console.log("file available at", url);
	;	cb(null, url);
	});
// remove file after uploaded?
}

var saveFile = function(blob, name, type) {
	var uploadFileSync = Meteor._wrapAsync(uploadFile);
	fs.writeFileSync(name, blob, {encoding: 'binary'});
	var s3Url = uploadFileSync(name);
	if (s3Url) {
		saveResume(name, s3Url, this.userId);
	}
}

Meteor.methods({
	'saveFile': saveFile
});