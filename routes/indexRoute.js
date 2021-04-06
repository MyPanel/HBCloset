import express from 'express';
const router = express.Router();

router.get('/',(req,res)=>{
    if(req.session.passport) {
        var currentUser = req.session.passport.user;
        res.render('home',{currentUser});
    } else res.render('home');
});


module.exports = router;