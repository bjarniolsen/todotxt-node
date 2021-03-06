var server = require("./lib/server");
var router = require("./lib/router");
var requestHandlers = require("./lib/requestHandlers");

var handle =  {};
handle[''] = requestHandlers.show;
handle['todo'] = requestHandlers.show;
handle['add'] = requestHandlers.add;
handle['edit'] = requestHandlers.edit;
handle['update'] = requestHandlers.update;
handle['del'] = requestHandlers.del;
handle['complete'] = requestHandlers.complete;

server.start(router.route, handle);
