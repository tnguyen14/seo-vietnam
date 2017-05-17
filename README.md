#SEO Vietnam Web Application

[![Greenkeeper badge](https://badges.greenkeeper.io/tnguyen14/seo-vietnam.svg)](https://greenkeeper.io/)

##Architecture
- [Meteor](http://meteor.com)
- [AWS S3](http://aws.amazon.com/s3/)

### Deployment
See [deployment guide](deploy.md)

### Staging
A staging version of the app is hosted on Heroku at [http://seo-vietnam-staging.herokuapp.com](http://seo-vietnam-staging.herokuapp.com)

## User Application
### Status
The proposed statuses an application can have include:

- started
- completed
- graded
- closed

Information about the project, including scope, timeline, and structure are documented at the [Wiki pages](https://github.com/tnguyen14/seo-vietnam/wiki).

### Required Information
Currently, for each application, the required information are:

- college
- graduation-date
- major
- essay.one
- essay.two
- essay.three
- essay.four
- files.resume

## Development
### File upload
UI feedback is currently a hack: it depends on the change in filename on the backend to refresh the page and thus remove any upload template.

There should be a way to update the front end when file upload is complete.