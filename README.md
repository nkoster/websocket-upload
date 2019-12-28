# Web Socket Upload

Upload a huge file in chunks over a web socket connection.
I'm using the [https://socket.io/](socket.io) web socket framework for server and client web socket logic. 
Front JS borrowed from https://gist.github.com/alediaferia/cfb3a7503039f9278381

DISCLAIMER: I'm not sure if this is a good idea, but it actually works.
This is currently an experiment in progress. I'm very open for comments.

Usage:

```
git clone https://github.com/nkoster/filereader
cd filereader
npm install
./node_modules/nodemon/bin/nodemon.js server.js
````
