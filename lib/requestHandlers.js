var fs = require("fs"),
    file = "/home/bjarniolsen/Dropbox/todo/todo2.txt";

function show(response, postData, action) {
    console.log("Request handler 'show' was called");

    fs.readFile(file, "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = data.split("\n"),
            context = data.match(/(\+[a-z.-]+)/gi),
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
            '<select name="context">';
        // TODO: Remove duplicates
        /*
        function sort_and_unique( my_array ) {
            my_array.sort();
            for ( var i = 1; i < my_array.length; i++ ) {
                if ( my_array[i] === my_array[ i - 1 ] ) {
                            my_array.splice( i--, 1 );
                }
            }
        return my_array;
        };
        */
        for (var i=0; i < context.length; i++) {
            body += '<option>'+
                    context[i]+
                    '</option>';
        }
        body += '</select>'+
            '<input type="submit" value="Opret" />'+
            '</form>'+
            '<ol>';
        for (var i=0; i < tasklist.length-1; i++) {
            index = i + 1;
            body += '<li>'+ 
                    tasklist[i]+
                    '<a href="/edit/' + index + '">edit</a>'+
                    ' '+
                    '<a href="/del/' + index + '">delete</a>'+
                    ' '+
                    '<a href="/complete/' + index + '">complete</a>'+
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

function del(response, postData, action) {
    console.log("Request handler 'del' was called with number: " + action);

    fs.readFile(file, "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = [];
        tasklist = data.split("\n");
        var position = action - 1;
        var newtasklist = tasklist.splice(position, 1);

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

function complete(response, postData, action) {
    console.log("Request handler 'complete' was called with number: " + action);

    fs.readFile(file, "ascii", function(err, data) {
        if (err) throw err;

        var tasklist = [];
        tasklist = data.split("\n");
        var position = action - 1;
        var oldtask = tasklist[position];
        var newtask = "x " + oldtask;
        var newtasklist = tasklist.splice(position, 1, newtask);

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
exports.del = del;
exports.complete = complete;
