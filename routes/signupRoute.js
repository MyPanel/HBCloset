module.exports = (router,connection, passport) => {
    router.get('/',(req,res)=>{
        res.render('signup')
    });

	router.post('/try', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

    return router;
};