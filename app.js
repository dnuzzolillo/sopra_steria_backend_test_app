var express = require('express');
const request = require('request');
var app = express();

// Middeleware for auth
function auth(id){
    var isUser = false;
    var isAdmin = false;
    return new Promise((resolve, reject) => {
        request('http://www.mocky.io/v2/5808862710000087232b75ac', { json: true }, (err, resp, body) => {
            if (err || resp.body === undefined) { 
                // error handling
                reject({
                    message: 'error',
                    statusCode: 500
                });
                console.log('error'); 
            }
            
            // authentication check
            for(x in resp.body.clients){
                if(resp.body.clients[x].id == id && (resp.body.clients[x].role == 'user' || resp.body.clients[x].role == 'admin')){
                    // is authenticated
                    if(resp.body.clients[x].role == 'admin'){ // is admin
                        isUser = true;
                        isAdmin = true;
                    }else{ // is user
                        isUser = true;
                        isAdmin = false;
                    }
                    
                }
            }
            
            if(isUser){
                // return user permissions
                resolve({
                    isUser : isUser,
                    isAdmin : isAdmin,
                    cList: resp.body.clients
                })
            }else{
                // Not a user       
                reject({
                    message: 'Unauthorized',
                    statusCode: 401
                });
            }
        })
    })
}

// get user info
app.get('/getUser/:by/:param/:authId', function (req, res) {
    
        // get by id
        auth(req.params.authId).then((a) =>{
            if(req.params.by == 'id' && a.isUser){
                var id = req.params.param; // requested user id
                for(x in a.cList){
                    if(a.cList[x].id == id){ // Match
                        res.status(200);
                        res.send(a.cList[x]); 
                        return false // die
                    }
                }
                console.log(`User: ${id} was not found`)
                res.status(404);
                res.send(`User: ${id} was not found`); // If nothing match on the loop
                return false; // die
            }
            // get by name
            if(req.params.by == 'name' && a.isUser){
                var name = req.params.param; // requested user name
                var response = [];
                // names are very commonly repeated so it will be set to return an array of matches
                for(x in a.cList){
                    if(a.cList[x].name.toLowerCase() == name.toLowerCase()){ // match (not case sensitive)
                        response.push(a.cList[x]);
                    }
                }
                if (response.length > 0) {
                    res.status(200);
                    res.send(response); // Match
                    return false; // die
                }else{
                    console.log(`${name} doesn't match with any user name`);
                    res.status(404);
                    res.send(`${name} doesn't match with any user name`); // If nothing match on the loop
                    return false; // die
                }
            }
            // get by policy
            if(req.params.by == 'policy' && a.isAdmin){
                var pId = req.params.param
                request('http://www.mocky.io/v2/580891a4100000e8242b75c5', { json: true }, (err, resp, body) => {
                    var p = resp.body.policies.find(obj =>{
                        return obj.id == pId
                    })    
                    if (p == undefined){ // no match
                        console.log(`Policy with id ${pId} does not exist`);
                        res.status(404);
                        res.send(`Policy with id ${pId} does not exist`); // If nothing match on the loop
                        return false; // die
                    }
                    var u = a.cList.find(obj =>{
                        return obj.id = p.clientId
                    })
                    if (u == undefined){ // no match
                        console.log(`Couldn't find any user related to this policy`);
                        res.status(404);
                        res.send(`Couldn't find any user related to this policy`); // If nothing match on the loop
                        return false; // die
                    }
                    res.send(u);
                })
                
            }else if(req.params.by == 'policy' && !a.isAdmin){ // if not admin
                // Not authorized user
                console.log(`Authetication error user: ${req.params.authId} has not admin permissions`); // Log error
                res.status(401);
                res.send('Authetication error');
                return false; // die 
            }else{
                res.status(400); // bad request
                res.send('Your request could not be handled');
                return false; // die  
            }
        },err =>{
            // auth error
            console.log(`Authetication error user: ${req.params.authId} is not Autheticated`); // Log error
            res.status(err.statusCode);
            res.send(err.message);
        })
        
        
});
// get policy
app.get('/getPolicy/:name/:authId', function (req, res) {

    auth(req.params.authId).then(a => {
        if(a.isAdmin){
            var userId;
            var name = req.params.name; // requested user name
            for(x in a.cList){
                if(a.cList[x].name.toLowerCase() == name.toLowerCase()){ // Match
                    var clientId = a.cList[x].id; 
                    request('http://www.mocky.io/v2/580891a4100000e8242b75c5', { json: true }, (err, resp, body) => {
                
                        var response = [];

                        for(x in resp.body.policies){
                            if(resp.body.policies[x].clientId == clientId){ // match (not case sensitive)
                                response.push(resp.body.policies[x]);
                            }
                        }
                        if (response.length > 0) {
                            res.status(200);
                            res.send(response); // Match
                            return false; // die
                        }else{
                            console.log(`No policies found for ${name}`);
                            res.status(404);
                            res.send(`No policies found for ${name}`); // If nothing match on the loop
                            return false; // die
                        } 
                    })
                    return false // die
                }
            }
            res.status(404);
            res.send(`${name} doesn't match with any user name`); // If nothing match on the loop
            return false; // die
            
        }else{
           // Not authorized user
           console.log(`Authetication error user: ${req.params.authId} has not admin permissions`); // Log error
           res.status(401);
           res.send('Authetication error');
           return false; // die 
        }
    },err =>{
        // auth error
        console.log(`Authetication error user: ${req.params.authId} is not Autheticated`); // Log error
        res.status(err.statusCode);
        res.send(err.message);
    })
})

app.listen(3000, function () {
  console.log('listening on port 3000');
});