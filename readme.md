# MPlan

> A degree planner made by students for students

# Getting the code to work locally

You'll need to ensure the following are installed:

* [node](https://nodejs.org/en/download/)
* [mongodb](https://docs.mongodb.com/manual/installation/)

Restore the database. Make sure you're in the same directory at this file.

    mongorestore ./database-backup.tgz

Restore the node dependencies and build the project

    npm install
    npm run build

> If you're on macOS, you may need to chown `/data/db`
> You can do that like so:
> 
> `chown -R $(whoami) /data/db`

Start the DB and server (run this from this directory):

    # start the database
    mongod
    # start the server
    npm start

You can then see the project by open your browser to [http://localhost:8090](http://localhost:8090)
