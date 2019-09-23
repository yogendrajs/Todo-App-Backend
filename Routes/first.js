let checkToken = require('../middleware');
require('dotenv').config();

module.exports = function(todo, knex, jwt){
    todo.get('/get', checkToken,(req,res)=>{
        jwt.verify(req.token, process.env.SECRET, function(err, authData) {
            if(!err){
                //   let authData = JSON.parse(authData);
                // console.log('this is auth', authData.allData);
                var userId = authData.allData.userId
                knex('secret')
                .where('secret.userId', userId)
                .then(data => {
                    return res.json(data)
                })
                .catch(err => console.log(err.message))
            }
            else{
                    console.log(err);
                    res.json('token is not valid')
                }
        });
    })

    todo.post('/post', checkToken, (req,res)=>{
        var data = {item: req.body.itemArg.item, done: req.body.itemArg.done};

        jwt.verify(req.token, process.env.SECRET, (err, authData)=>{
            if(!err){
                data.userId = authData.allData.userId;
                knex('secret')
                .insert(data)
                .then(() => {
                    knex('secret')
                    .where('secret.userId',data.userId)
                    .then(data => res.send(data))
                    .catch(err => console.log(err.message))
                })
                .catch((err) => console.log(err.message))
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        })    
    })

    todo.put('/update/:id', checkToken, (req,res)=>{
        // var id = parseInt(req.params.id)+1;
        // console.log('original',req.params.id)
        jwt.verify(req.token, process.env.SECRET, function(err, authData){
            if(!err){
                var userId = authData.allData.userId
                knex('secret')
                .where('secret.id', req.params.id)
                .update({
                    "item":req.body.editItem
                })
                .then(() => {
                    knex('secret')
                    .where('secret.userId',userId)
                    .then(data =>{
                        res.send(data)
                    })
                    .catch((err)=>{
                        console.log(err.message)
                    })
                })
                .catch((err)=>{
                    console.log(err.message)
                })
            }
            else{
              res.json('token is not valid')
            }
        })
    })

    todo.put('/checkbox', checkToken, (req,res) =>{
        // console.log(req.params.id)
        jwt.verify(req.token, process.env.SECRET, (err,authData) =>{
            if(!err){
                var userId = authData.allData.userId
                knex('secret')
                .where("secret.id", req.body.id)
                .andWhere('secret.userId', userId)
                .update({
                    done:req.body.done
                })
                .then(() => {
                    knex('secret')
                    .where('secret.userId', userId)
                    .then(data => res.send(data))
                    .catch(err => console.log(err.message))
                })
                .catch((err) => console.log(err.message))
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        })
    })

    todo.delete('/delete/:id', checkToken, (req,res) =>{
        jwt.verify(req.token, process.env.SECRET, (err, authData) =>{
            if(!err){
                var userId = authData.allData.userId;
                console.log('jwt verified')
                knex('secret')
                .where('secret.id', req.params.id)
                .del()
                .then(() => {
                    knex('secret')
                    .where('secret.userId', userId)
                    .then((data) => res.send(data))
                    .catch(err => console.log(err.message));
                })
                .catch(err => console.log(err))
            }
            else{
                console.log(err);
                res.json('token is not valid')
            }
        })
    })
}