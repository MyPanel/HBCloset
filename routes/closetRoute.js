const { url } = require('inspector');

module.exports = (router,db) => {
    const multer = require('multer');
    const fs = require('fs');
    const path = require('path');

    var upload = multer({storage: multer.diskStorage({
        destination: (req,file,callback) => {
            var dir = __dirname+'/../public/image/clothes/'+req.body.name+'/';
            if(!fs.existsSync(dir)) fs.mkdirSync(dir);   
            callback(null,dir);
        },
        filename: (req,file,callback) => {
            var saveName = req.files.length+'.jpg';
            if(req.files.length==1) {
                db.query('insert into clothes (name,cost,category) values(?,?,?)',[req.body.name,req.body.cost,req.body.category],(err)=>{
                    console.error(err);
                })
            }
            callback(null,saveName);
        }
    })});


    var update_img = multer({storage: multer.diskStorage({
        destination: (req,file,callback) => {
            var dir = __dirname+'/../public/image/clothes/'+req.body.name+'/';
            if(!fs.existsSync(dir)) fs.mkdirSync(dir);   
            callback(null,dir);
        },
        filename: (req,files,callback) => {
            var dir = __dirname+'/../public/image/clothes/'+req.body.name+'/';
            fs.readdir(dir,(err,file)=>{
                var saveName = (file.length+1)+'.jpg';
                callback(null,saveName);
            })
        }
    })});

    router.get('/',(req,res)=>{
        var clothes;
        db.query("SELECT * FROM clothes WHERE category = ?", "top" , (err, rows) => {
            clothes=rows;
            if(req.session.passport) {
                var currentUser = req.session.passport.user;
                
                res.render('list',{currentUser,list:rows});
            } else {
                res.render('list',{list:rows});
            }
        })
    });

    router.get('/add_page',(req,res)=>{
        if(req.session.passport.user.admin==1) {
            res.render('addCloset')
        } else {
            res.render('/');
        }
    });

    router.post('/add',upload.array('img',10),(req,res) => {
        res.redirect('../closet');
    })


    // 리스트 띄우는 라우터들  
    router.get('/top',(req,res)=>{
        var clothes;
        db.query("SELECT * FROM clothes WHERE category = ?", "top" , (err, rows) => {
            clothes=rows;
            if(req.session.passport) {
                var currentUser = req.session.passport.user;
                
                res.render('list',{currentUser,list:rows});
            } else {
                res.render('list',{list:rows});
            }
        })

    });

    router.get('/bottom',(req,res)=>{
        var clothes;
        db.query("SELECT * FROM clothes WHERE category = ?", "bottom" , (err, rows) => {
            clothes=rows;
            if(req.session.passport) {
                var currentUser = req.session.passport.user;
                
                res.render('list',{currentUser,list:rows});
            } else {
                res.render('list',{list:rows});
            }
        })

    });

    router.get('/acc',(req,res)=>{
        var clothes;
        db.query("SELECT * FROM clothes WHERE category = ?", "acc" , (err, rows) => {
            clothes=rows;
            if(req.session.passport) {
                var currentUser = req.session.passport.user;
                
                res.render('list',{currentUser,list:rows});
            } else {
                res.render('list',{list:rows});
            }
        })

    });

    router.get('/outer',(req,res)=>{
        var clothes;
        db.query("SELECT * FROM clothes WHERE category = ?", "outer" , (err, rows) => {
            clothes=rows;
            if(req.session.passport) {
                var currentUser = req.session.passport.user;
                
                res.render('list',{currentUser,list:rows});
            } else {
                res.render('list',{list:rows});
            }
        })

    })

    router.get('/detail/:id',(req,res)=>{
        var selectid = req.params.id;
        db.query("SELECT * FROM clothes WHERE id = ?", selectid , (err, rows) => {
            var detail = rows;
            var dir = __dirname+'/../public/image/clothes/'+detail[0].name+'/';
            fs.readdir(dir,(err,files)=>{

                if(req.session.passport) {
                    var currentUser = req.session.passport.user;
                    res.render('detailView',{detail,length:files.length,currentUser});
                } else {
                    res.render('detailView',{detail,length:files.length});
                }
            })
        })
    });

    router.get('/detail/update/:id',(req,res)=>{
        var selectid = req.params.id;
        db.query("SELECT * FROM clothes WHERE id = ?", selectid , (err, rows) => {
            var detail = rows;
            var dir = __dirname+'/../public/image/clothes/'+detail[0].name+'/';
            fs.readdir(dir,(err,files)=>{

                if(req.session.passport) {
                    var currentUser = req.session.passport.user;
                    res.render('updateCloth',{detail,length:files.length,currentUser});
                } else {
                    res.render('updateCloth',{detail,length:files.length});
                }
            })
        })
    })

    router.post('/deleteImage',(req,res)=>{
        var url = req.body.url;
        var name = req.body.name;
        var imgNum = req.body.imgNum
        var dir = __dirname + '/../public/image/clothes/' + name + '/';

        fs.readdir(dir,(err, files)=>{
            console.log(files);
            for(var i = 0; i<files.length; i++) {
                // if(files.length==1) {
                    // 1장 이상의 이미지가 남아 있어야 합니다. (alert경고문 작성)
                // }
                if(files[i]==(imgNum+'.jpg')) {
                    fs.unlink(__dirname+'/..'+url,(err)=>{
                        for(var j=1; j<=files.length; j++) {
                            if(!fs.existsSync(dir+j+'.jpg')) {
                                for(var k=j+1;k<=files.length; k++) {
                                    fs.rename(dir+k+'.jpg',dir+(k-1)+'.jpg',(err)=>{
                                        res.json({nowFileslength:files.length-1});
                                    })
                                }
                            }
                        }
                    });
                }

            }
        })
    });

    router.post('/update/:id',update_img.array('img'),(req,res)=>{
        var selectid = req.params.id;
        db.query('update clothes set name = ?, category = ?, cost = ? where id = ?',[req.body.name,req.body.category,req.body.cost,selectid],(err)=>{
            console.error(err);
            res.redirect('/closet/'+req.body.category);
        });
    })
    
    return router;
};