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
            '<label for="add">Ny opgave</label>'+
            '<input type="text" name="add">'+
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
    postData = postData.add + "\n";
    console.log("Request handler 'add' was called, and postData is: " + postData);
    fs.open(file, 'a', 666, function(err, id) {
        fs.write(id, postData, null, 'utf8', function(err) {
            if (err) throw err;
            console.log("write to file");
            fs.close(id, function() {
                console.log("file closed");
                response.writeHead(302, {
                    'Location': '/'
                });
                response.end();
            });
        });
    });
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
            '<label for="update">Rediger opgave</label>'+
            '<textarea name="update" rows="15" cols="20">'+
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

    postData = postData.update;
    fs.readFile(file, "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = [];
        tasklist = data.split("\n");
        var position = action - 1;
        var oldtask = tasklist[position];
        var newtasklist = tasklist.splice(position, 1, postData);

        fs.open(file, "w+", function(err, fd) {
            if (err) throw err;
            
            var offset = 0,
                position = null;
            for (var i=0; i < tasklist.length-1; i++) {
                buffer = new Buffer(tasklist[i] + "\n"),
                console.log(tasklist[i]);
                fs.write(fd, buffer, offset, buffer.length, position, function(error, written) {
                    if (error) throw err;
                    console.log('Written ' + written + ' bytes to the file');
                    response.writeHead(302, {
                        'Location': '/'
                    });
                    response.end();
                });
            }
        });
    });
}

exports.show = show;
exports.add = add;
exports.edit = edit;
exports.update = update;
