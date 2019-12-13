
# Soft Phone Server

## Create 

Before running the server make sure to place your Twilio credentials in
your `twilio-config.json` file at the root of the package with the format below.

```json
{
    "accountSid": "<Your account SID>",
    "applicationSid": "<Your application SID>",
    "authToken": "<Your account auth token>"
}
```

## Start Server

Once your `twilio-config.json` is created you can start the server.

```sh
$ npm install   # install packages
$ sudo npm start     # start server
```
