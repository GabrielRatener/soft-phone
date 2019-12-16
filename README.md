
# Soft Phone

## Configure Twilio 

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
```

```sh
$ npm start server    # start server on port 8080
```

Or

```sh
$ sudo npm start server 80     # start server on port 80
```

## Go to Web Page

Now visit http://127.0.0.1