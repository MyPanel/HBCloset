var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = (passport,db) => {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(email, done) {
        db.query('SELECT * from user where email = ? ', [email] ,(error, email, fields) => {
            if (error) throw error;
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true,
            session: true
        },
        function(req, email, password, done) {

            db.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
                console.log(rows);
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    var newUserMysql = {
                        email,
                        password:bcrypt.hashSync(password, null, null),
                        username:req.body.username
                    };
                    console.log(newUserMysql);
                    db.query("INSERT INTO user ( email, password, username ) values (?,?,?)", newUserMysql, (err, rows) => {
                        // newUserMysql.email = rows.username;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        (req, username, password, done) => { // callback with email and password from our form
            db.query("SELECT * FROM user WHERE email = ?", [username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user
                console.log(rows[0]);
                return done(null, rows[0]);
            });
        })
    );

}

// expose this function to our app using module.exports
// module.exports = function(passport) {

//     // =========================================================================
//     // passport session setup ==================================================
//     // =========================================================================
//     // required for persistent login sessions
//     // passport needs ability to serialize and unserialize users out of session

//     // used to serialize the user for the session
//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//     });

//     // used to deserialize the user
//     passport.deserializeUser(function(id, done) {
//         connection.connect();
//         connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
//             done(err, rows[0]);
//         });
//         connection.end();
//     });

//     // =========================================================================
//     // LOCAL SIGNUP ============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
//     // by default, if there was no name, it would just be called 'local'



//     // =========================================================================
//     // LOCAL LOGIN =============================================================
//     // =========================================================================
//     // we are using named strategies since we have one for login and one for signup
//     // by default, if there was no name, it would just be called 'local'

    // passport.use(
    //     'local-login',
    //     new LocalStrategy({
    //         // by default, local strategy uses username and password, we will override with email
    //         usernameField : 'username',
    //         passwordField : 'password',
    //         passReqToCallback : true // allows us to pass back the entire request to the callback
    //     },
    //     function(req, username, password, done) { // callback with email and password from our form
    //         connection.connect();
    //         connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
    //             if (err)
    //                 return done(err);
    //             if (!rows.length) {
    //                 return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    //             }

    //             // if the user is found but the password is wrong
    //             if (!bcrypt.compareSync(password, rows[0].password))
    //                 return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

    //             // all is well, return successful user
    //             return done(null, rows[0]);
    //         });
    //         connection.end();
    //     })
    // );
// };