var fs = require("fs");

function show(response, postData) {
    console.log("Request handler 'show' was called");

    fs.readFile("/home/bjarniolsen/Dropbox/todo/todo.txt", "ascii", function(err, data) {
        if (err) throw err;

        var dataarray = data.split("\n");

        var body = '<html>'+
            '<head>'+
            '<title>todotxt-node</title>'+
            '<meta http-equiv="Content-Type" content="text/html; '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>'+
            '<h1>todo.txt</h1>'+
            '<form action="/add" method="post">'+
            '<label for="addtask">Ny opgave</label>'+
            '<input type="text" name="addtask">'+
            '<input type="submit" value="Opret" />'+
            '</form>'+
            '<ol>';
        for (var i=0; i < dataarray.length-1; i++) {
            body += '<li>'+ 
                    dataarray[i]+
                    '<a href="/edit">edit</a>'+
                    '</li>';
        }

        body += '</ol>'+
            '</body>'+
            '</html>';

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(body);
        response.end()
    });
}

function add(response, postData) {
    console.log("Request handler 'add' was called");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(postData);
    response.end()
}

function edit(response, postData) {
    console.log("Request handler 'edit' was called");
}

exports.show = show;
exports.add = add;
exports.edit = edit;
