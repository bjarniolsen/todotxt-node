var fs = require("fs");

function show(response, postData, action) {
    console.log("Request handler 'show' was called");

    fs.readFile("/home/bjarni/Dropbox/todo/todo.txt", "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = data.split("\n"),
            index;

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
        for (var i=0; i < tasklist.length-1; i++) {
            index = i + 1;
            body += '<li>'+ 
                    tasklist[i]+
                    '<a href="/edit/' + index + '">edit</a>'+
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

function add(response, postData, action) {
    console.log("Request handler 'add' was called");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(postData);
    response.end()
}

function edit(response, postData, action) {
    console.log("Request handler 'edit' was called with number: " + action.toString());
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(action.toString());
    response.end()
}

exports.show = show;
exports.add = add;
exports.edit = edit;
