require('dotenv').config();

const express = require('express')
, cors = require('cors')
, bodyParser = require('body-parser')
, session = require('express-session')
, port = 4000
, passport = require('passport') //like axios for auth
, Auth0strat = require('passport-auth0')
, app = express()
, massive = require('massive')

app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); //I'm assuming this allows passport to use express-session to link the user profile to a session. 

massive(process.env.CONNECTION).then(db=>{
    app.set("db",db);
})//establish connection to db and then set 'db' to this db connection. This is our wizard's portal. 

passport.use(new Auth0strat({
    domain: process.env.DOMAIN,
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: "openid profile"
}, function(accessToken, refreshToken, extraParams, profile, done ){
    const db = app.get("db");
    let {displayName, user_id, picture} = profile;
    db.findUser([user_id]).then(users=>{
        if (!users[0]){ //is no user got returned. In our sql function, it's already checking for a specific user. Now create a new user. 
            db.createUser([displayName,'test@email.com', picture, user_id]).then(user=>{
                return done(null, user[0].id);
            })
        }
        else {
           return done(null, users[0].id)//use just the id because this is what we're passing into the session. we don't need the entire profile - just the id. 
        }
    })
}))

passport.serializeUser((id, done)=>{
    done(null, id)
})//after this, profile gets passed to the session-store. Profile comes from the callback function directly above this in the code. After this, the session cookie is passed to the frontend that contains the sessionID. 

passport.deserializeUser((id, done)=>{

    app.get('db').findSessionUser([id]).then(function(user){
        return done(null, user[0]); //this is now passing out all user info from the database. 
    });
})//this gets hit between every endpoint. It checks the session store to make sure the sessionID is still open. This puts the user profile/second arg on req.user. 

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate("auth0", {
    successRedirect: 'http://localhost:3000/#/private', //this where the user will go after they are authenticated. 
    failureRedirect: 'http://localhost:3000/'
}));

app.get("/auth/me", function (req,res){ //this endpoint is going to return the data of the logged in user
    console.log(res.data);
    if (!req.user){
        res.status(404).send("user not found");
    }
    else {res.status(200).send(req.user)}
})

app.get('/auth/logout', function(req,res){
    req.logout();
    res.redirect('http://localhost:3000/')
})

app.listen(port, ()=>console.log('Big Brother listening on port 4000'));
 