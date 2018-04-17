# Sopra Steria Backend test app
Wellcome to Sopra Steria Backend test app. This app was done with the best quality i could offer. Hope you enjoy it!

### Dependecies

This test app uses a the following open source code to work properly:

* [Node.js](https://nodejs.org/es/) - As server
* [Express](http://expressjs.com/) - As API framework
* [Request](https://github.com/request/request) - As http resource handler

### Installation

It requires [Node.js](https://nodejs.org/) v4+ to run.
Install the dependencies and devDependencies and start the server.

```sh
$ cd app_folder
$ npm install
$ node app.js
```


### Paths

###### Get user data filtered by user id -> Can be accessed by users with role "users" and "admin"
```sh
http://localhost:3000/getUser/id/[requested_user_id]/[auth_user_id]
```
###### Get user data filtered by user name -> Can be accessed by users with role "users" and "admin".

```sh
http://localhost:3000/getUser/name/[requested_user_name]/[auth_user_id]
```
###### Get the list of policies linked to a user name -> Can be accessed by users with role "admin"

```sh
http://localhost:3000/getUser/policy/[policy_id]/[auth_user_id]
```
###### Get the user linked to a policy number -> Can be accessed by users with role "admin"

```sh
http://localhost:3000/getPolicy/[requested_user_name]/[auth_user_id]
```

### Auth

The atentication is always the id of the user who is requesting 
Ex.
```sh
http://localhost:3000/getUser/name/BritnEy/44e44268-dce8-4902-b662-1b34d2c10b8e
```

where 44e44268-dce8-4902-b662-1b34d2c10b8e is the id of the user how is requesting and will determinate the permissions.




