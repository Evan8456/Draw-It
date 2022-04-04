let module = {};

let send = function(method, url, data, json, callback){
    url = process.env.REACT_APP_BACKEND + url;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onload = function() {
        if (xhr.status !== 200) callback(xhr.status, xhr.responseText);
        else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else if(!json){
        xhr.send(data);
    } 
    else{
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
};

let sendGQL = function(data, callback) {
    let url = process.env.REACT_APP_BACKEND + "/graphql/";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onload = function() {
        if (xhr.status !== 200) callback(xhr.status, xhr.responseText);
        else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
};

module.login = function(username, password, callback, errCallback) {
    let data = {
        query: `mutation ($username: String!, $password: String!){
            signin(username: $username, password: $password)
        }`,
        variables: {username, password}
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.signup = function(username, password, callback, errCallback) {
    let data = {
        query: `mutation ($username: String!, $password: String!){
            signup(username: $username, password: $password)
        }`,
        variables: {username, password}
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.signout = function(callback, errCallback) {
    let data = {
        query: `query {
            signout
        }`,
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.authenticate = function(callback, errCallback) {
    let data = {
        query: `query {
            authenticate
        }`,
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.getPrivateDrawings = function(callback, errCallback) {
    let data = {
        query: `query {
            privateDrawings {
                name,
                _id,
                path
            }
        }`,
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.getPublicDrawings = function(callback, errCallback) {
    let data = {
        query: `query {
            publicDrawings {
                name,
                _id,
                path
            }
        }`,
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.saveImage = function(_id, image, callback, callbackerr) {
    let formdata = new FormData();
    formdata.append("_id", _id);
    formdata.append("image", image);



    send("POST", "/api/drawing", formdata, false, function(err, res) {
        if(err) return callbackerr(err);
        callback(res);
    });
};

module.getImage = function(_id, callback, callbackerr) {
    send("GET", "/api/drawing/"+_id, null, false, function(err, res) {
        if(err) return callbackerr(err);
        callback(res);
    });
};

module.addDrawing = function(name, publicBool, callback, errCallback) {
    let data = {
        query: `mutation ($name: String!, $public: Boolean!){
            addDrawing(name: $name, public: $public)
        }`,
        variables: {name, public:publicBool}
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.checkRoom = function(_id, callback, errCallback) {
    let data = {
        query: `mutation ($_id: String!){
            findRoom(_id: $_id)
        }`,
        variables: {_id}
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

module.checkLoad = function(_id, callback, errCallback) {
    let data = {
        query: `mutation ($_id: String!){
            loadImage(_id: $_id)
        }`,
        variables: {_id}
    };
    sendGQL(data, (err, res) => {
        if(err) errCallback(err, res);
        callback(res);
    });
};

export default module;