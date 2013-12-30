# Deployment
This app can be deployed to a Heroku instance. This is a guide to set it up and use it. Most of this guide is for the command-line.

## Set up
### Create a heroku app from a custom buildpack
```sh
$ heroku create APP_NAME --stack cedar --buildpack https://github.com/tnguyen14/heroku-buildpack-meteorite --remote REMOTE_NAME
```

### Set up environment variables
Use `heroku config:set KEY=VALUE --remote REMOTE_NAME` to set up environment variables. These include

- `S3_KEY`
- `S3_SECRET`
- `S3_BUCKET`
- `ROOT_URL` (usually in the form `http://APP_NAME.herokuapp.com`)
- `ADMIN_EMAIL`
- `SITE_NAME`
- `EMAIL_FROM`

**Enable websockets**
```sh
$ heroku labs:enable websockets -a APP_NAME
```

### Set up custom domain (optional)
Heroku guide for [adding custom domain](https://devcenter.heroku.com/articles/custom-domains)

## Use
Push to heroku with `git push REMOTE_NAME master`