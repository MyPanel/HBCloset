module.exports = (router,db,passport,io) => {
    
    router.get('/',(req,res)=>{
        if(req.session.passport) {
            var currentUser = req.session.passport.user;
            
            res.render('./chat/chat',{currentUser});
        } else {
            res.render('login');
        }
    });

    return router;
}