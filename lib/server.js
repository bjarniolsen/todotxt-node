var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        pathname = pathname.split("/");
        var controller = pathname[1];
        var action = pathname[2];
        console.log("Request for " + controller + " recieved - " + action);

        request.setEncoding("utf8");

        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Recieved postDataChunk '" + postDataChunk + "'.");
        });

        request.addListener("end", function() {
            route(handle, controller, action, response, postData);
        });
    } 

    http.createServer(onRequest).listen(8888);
    console.log("Server has started");
}

exports.start = start;
