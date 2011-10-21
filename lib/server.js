var http = require("http"),
    url = require("url"),
    querystring = require("querystring");
    sys = require("util");


function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        pathname = pathname.split("/");
        var controller = pathname[1];
        var action = pathname[2];
        console.log("Request for " + controller + " recieved - " + action);

        request.setEncoding("utf8");

        var postData = "";
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Recieved postDataChunk '" + postData + "'.");
        });

        request.addListener("end", function() {
            postData = querystring.parse(postData);
            route(handle, controller, action, response, postData);
        });
    } 

    http.createServer(onRequest).listen(8888);
    console.log("Server has started");
}

exports.start = start;
