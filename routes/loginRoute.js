module.exports = (router,connection, passport) => {
    router.get('/',(req,res)=>{
        res.render('login')
    });

	router.post('/try', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
        }),
        (req, res)=>{
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

    router.get('/logout', function(req, res){
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });

    return router;
};