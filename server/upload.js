var s3 = Meteor.require('s3'),
	fs = Npm.require('fs');

var client = s3.createClient({
	key: 'AKIAJKMWRVLM7K32FPMA',
	secret: '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',
	bucket: 'seo-vietnam'
});


var uploadFile = function(localFile) {
	var uploader = client.upload(localFile, 'resume-uploads/' + localFile);
	uploader.on('error', function(err) {
  console.error("unable to upload:", err.stack);
});
uploader.on('progress', function(amountDone, amountTotal) {
  console.log("progress", amountDone, amountTotal);
});
uploader.on('end', function(url) {
  console.log("file available at", url);
});
// remove file after uploaded?
}

var saveFile = function(blob, name, type, size) {
	fs.writeFile(name, blob, {
		encoding: 'binary'
	}, function() {
		uploadFile(name);
	});
}

Meteor.methods({
	'saveFile': saveFile
})