import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import fs from 'fs';
import fetch from 'node-fetch'

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));;


import sqlite3 from 'sqlite3'; 
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);
db.serialize (() => { 
const sql = `
CREATE TABLE IF NOT EXISTS Users
(id integer primary key, name TEXT, surname TEXT, lastname TEXT, phone_number TEXT, passport_info TEXT, login TEXT, password TEXT, path TEXT)`;
db.run(sql);
});

class User {
  static registration(name, surname, lastname, phone_number, passport_info, login, password, path, cb)
  {
    const sql = 'INSERT INTO Users(name, surname, lastname, phone_number, passport_info, login, password, path) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, name, surname, lastname, phone_number, passport_info, login, password, path, cb)
  }

  static findbyLogin(login, cb)
  {
    db.get("SELECT * FROM Users WHERE login=?", login, cb);
  }

  static find(login, password, cb)
  {
    db.get("SELECT * FROM Users WHERE login=? AND password=?", login, password, cb);
  }

  static change(name, surname, lastname, phone_number, passport_info, login, password, path, cb)
  {
    const sql = 'update Users set name=?, surname=?, lastname=?, phone_number=?, passport_info=?, path=? where login=?';
    db.run(sql, name, surname, lastname, phone_number, passport_info, path, login, cb);
  }

  static delete(login, cb)
  {
    const sql = "DELETE FROM Users WHERE login=?";
    db.run(sql, login, cb);
  }
}

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser. urlencoded({ extended: true } ));
/*app.use(
  '/css/normalize.css',
  express.static('/css/normalize.css')
);
app.use(
  '/css/style.css',
  express.static('/css/style.css')
);*/

app.get('/', (req, res, next) => {
  res.format({ 
    html: () => {
    res.render('index.ejs', {"error": "no"});
    },
    json: () => {
    
    }
    });
});

app.get('/profile:id', (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  User.findbyLogin(login, (err, user)=>
  {
    console.log(login);
    if (!err && user)
    {
      res.format({ 
        html: () => {
        res.render('change_data.ejs', {"name": user.name, "surname": user.surname, "lastname": user.lastname, "phone": user.phone_number, "passport": user.passport_info, "login":login, "password": user.password, "path": "avatars/"+user.path});
  
        },
        json: () => {
        
        }
        });
    }
  });
  
});

app.get('/delete:id', (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  User.findbyLogin(login, (err, user)=>
  {
    console.log(login);
    if (!err && user)
    {
      User.delete(login, ()=>{
        res.format({ 
          html: () => {
          res.render('index.ejs', {"error": "no"});
    
          },
          json: () => {
          
          }
          });
      })
      
    }
  });
  
});

app.post('/changed', (req, res, next) => {
  User.change(req.body.Name, req.body.Surname, req.body.Lastname, req.body.phone, req.body.passport, req.body.login, req.body.password, req.body.login + ".jpg", (err, user)=>{});
  const url = req.body.url;

    async function download() {
      if (url.trim() != "") {
        const response = await fetch(url);
        const buffer = await response.buffer();
        console.log(`/avatars/${req.body.path}`);
        fs.writeFile(`${__dirname}/avatars/${req.body.login}.jpg`, buffer, (err) => 
          console.log(err));
      }
    }

    download();
  res.render('authorizated.ejs', {login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
});

app.get('/registration', (req, res, next) => {
  res.format({ 
    html: () => {
    res.render('registration.ejs', {error: "not_error"});
    },
    json: () => {
    
    }
    });
});

app.post('/authorizated', (req, res, next) => {
  User.findbyLogin(req.body.login, (err, user) => {
    if (user != undefined) {
       res.render('registration.ejs', {error: "error"});
       return false;
    }
  });
  User.registration(req.body.Name, req.body.Surname, req.body.Lastname, req.body.phone, req.body.passport, req.body.login, req.body.password, req.body.login + ".jpg", (err, user ) => {
    if (err) return next(err);});
  User.find(req.body.login, req.body.password, (err, user) => {
    if (err) {
       res.render('failed_to_signup.ejs');
       return false;
    }
    const url = req.body.url;

    async function download() {
      if (url.trim() != "") {
        const response = await fetch(url);
        const buffer = await response.buffer();
        console.log(`/avatars/${req.body.path}`);
        fs.writeFile(`${__dirname}/js/avatars/${req.body.login}.jpg`, buffer, (err) => 
          console.log(err));
      }
    }

    download();
    res.render('authorizated.ejs', {login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
  });
});

app.post('/entered', (req, res, next) => {
  console.log(69);
  User.find(req.body.login, req.body.password, (err, user) => {
    if (err || user == undefined) {
      res.render('index.ejs', {error: "error"});
      return false;
    }
    res.render('authorizated.ejs', {login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
  });
});






app.listen(app.get('port'), () => {
  console.log("App started on port", app.get('port'));
})

