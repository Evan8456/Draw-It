let module = {};

let send = function(method, url, data, json, callback){
    console.log(url)
    url = process.env.REACT_APP_BACKEND + url;
    console.log(url)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onload = function() {
        if (xhr.status !== 200) callback(xhr.status, xhr.responseText);
        else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else if(!json) xhr.send(data);
    else{
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
};


module.login = function(username, password, callback, errCallback) {
    let data = {username: username, password: password};
    send("POST", "/signin/", data, true, function(err, res) {
        if (err) return errCallback(err, res);
        callback(res);
    });
};

module.signup = function(username, password, callback, errCallback) {
    let data = {username: username, password: password};
    send("POST", "/signup/", data, true, function(err, res) {
        if (err) return errCallback(err, res);
        callback(res);
    });
};

module.signout = function(callback, errCallback) {
    send("GET", "/signout/", null, false, function(err, res) {
        if(err) return errCallback(err, res);
        callback(res);
    });
};

module.authenticate = function(callback, errCallback) {
    send("GET", "/authenticate/", null, false, function(err, res) {
        if(err) return errCallback(err, res);
        callback(res);
    })
}

export default module;