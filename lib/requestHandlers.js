var fs = require("fs"),
    file = "/home/bjarniolsen/Dropbox/todo/todo2.txt";

function show(response, postData, action) {
    console.log("Request handler 'show' was called");

    fs.readFile(file, "ascii", function(err, data) {
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
    fs.readFile(file, "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = data.split("\n");
        var body = '<html>'+
            '<head>'+
            '<title>todotxt-node</title>'+
            '<meta http-equiv="Content-Type" content="text/html; '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>'+
            '<h1>todo.txt</h1>'+
            '<form action="/update/' + action + '" method="post">'+
            '<label for="updatetask">Rediger opgave</label>'+
            '<textarea name="updatetask" rows="15" cols="20">'+
            tasklist[action - 1]+
            '</textarea>'+
            '<input type="submit" value="Opdater" />'+
            '</form>'+
            '</body>'+
            '</html>';
    
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(body);
        response.end()
    });
}

function update(response, postData, action) {
    console.log("Request handler 'update' was called with number: " + action);

    fs.readFile(file, "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = [];
        tasklist = data.split("\n");
        console.log("old task list: " + tasklist);
        var position = action - 1;
        var oldtask = tasklist[position];
        var newtasklist = tasklist.splice(position, 1, postData);
        console.log("new task list: " + tasklist);

        /*
        fs.open(file, "w+", function(err, fd) {
            if (err) throw err;
            
            var offset = 0,
                buffer = new Buffer(data),
                position = null;
            for (var i=0; i < newtasklist.length-1; i++) {
                fs.write(fd, buffer, offset, buffer.length, position, function(error, written) {
                    console.log('Written ' + written + ' bytes to the file');
                });
            }
        });
        */
    });
}

exports.show = show;
exports.add = add;
exports.edit = edit;
exports.update = update;
