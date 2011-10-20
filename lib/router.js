function route(handle, controller, action, response, postData) {
    console.log("About to route a request for " + controller);
    if (typeof handle[controller] === 'function') {
        return handle[controller](response, postData, action);
    } else {
        console.log("No request handler found for " + controller);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;
