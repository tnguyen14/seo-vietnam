#SEO Vietnam Web Application

##Architecture
- [Meteor](http://meteor.com)

### Staging
- A staging version of the app is hosted by Meteor at [http://seo-vietnam.meteor.com](http://seo-vietnam.meteor.com)

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
- major
- essay-community
- essay-leadership
- essay-passion

## Development
### File upload
UI feedback is currently a hack: it depends on the change in filename on the backend to refresh the page and thus remove any upload template.

There should be a way to update the front end when file upload is complete.