module.exports = (router,connection,passport,io) => {

    router.get('/',(req,res)=>{
        res.render('home');
    });
    return router;
}