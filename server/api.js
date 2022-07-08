const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('express');
// const { default: playlists } = require('../client/app');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


module.exports = function (app, db) {
    app.post('/api/posts', verifyToken, async function (req, res) {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.json({
                    message: 'Post created...',
                    authData
                })
            }
        })

    });
    app.post('/api/login', async function (req, res) {
        try {
            const { username, password } = req.body
            const userN = await db.oneOrNone(`select username from users where username= $1 and password = $2 `,[username,password])
            console.log(username)
           if(userN){
            res.json({
                status: "success"
            })
           }
           else{
               res.json({
                   status: "Unknown entry"
               })
           }
        } catch (error) {
            console.log(error);
            res.json({ error })
        }
    });

    app.post('/api/signup', async function (req, res) {
        try {
            const { username, password } = req.body

            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(password, salt);

             await db.oneOrNone(`insert into users (username,password) values ($1,$2)`,[username,password])

                res.json({
                  status:  "success"
                })
        } catch (error) {
            res.json(error.message)
        }
    })


    app.post('/api/playlist', async function (req, res) {
     
            const {
                movieName,
                img,
                
            } = req.body;

        if (!movieName || !img) {
                res.json({
                    status: 'error',
                    message: 'Not enough info',
                });
            } else {
                playlist.push({
                    movieName,
                    img,
                });
    
                res.json({
                    status: 'success',
                    message: 'New movie added',
                });
            }
        
        });



    function verifyToken(req, res, next) {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.sendStatus(403)
        }
    }
}