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

db.serialize (() => { 
  const sql = `
  CREATE TABLE IF NOT EXISTS Records
  (id integer primary key, rate_id INTEGER, login INTEGER, first_date TEXT, last_date TEXT, unique(id, rate_id)); insert into Rooms(room_id) values(1); insert into Rooms(room_id) values(2); insert into Rooms(room_id) values(3); insert into Rooms(room_id) values(4); insert into Rooms(room_id) values(5);`;
  db.run(sql);
  });

db.serialize (() => { 
  const sql = `
  CREATE TABLE IF NOT EXISTS Rooms
  (id integer primary key, room_id INTEGER, unique(id, room_id)); insert into Rooms(room_id) values(1); insert into Rooms(room_id) values(2); insert into Rooms(room_id) values(3); insert into Rooms(room_id) values(4); insert into Rooms(room_id) values(5);`;
  db.run(sql);
  });

  db.serialize (() => { 
    const sql = `
    CREATE TABLE IF NOT EXISTS Rates
    (id integer primary key, room_id INTEGER, with_breakfast INTEGER, price_for_night INTEGER, unique(id, room_id)); insert into Rates(room_id, with_breakfast, price_for_night) values (1, 0, 99500); insert into Rates(room_id, with_breakfast, price_for_night) values (1, 1, 105500); insert into Rates(room_id, with_breakfast, price_for_night) values (2, 0, 47500); insert into Rates(room_id, with_breakfast, price_for_night) values (1, 1, 51500); insert into Rates(room_id, with_breakfast, price_for_night) values (3, 0, 19500); insert into Rates(room_id, with_breakfast, price_for_night) values (3, 1, 21500); insert into Rates(room_id, with_breakfast, price_for_night) values (4, 0, 11500); insert into Rates(room_id, with_breakfast, price_for_night) values (4, 1, 13000); insert into Rates(room_id, with_breakfast, price_for_night) values (5, 0, 5600); insert into Rates(room_id, with_breakfast, price_for_night) values (5, 1, 6500);`;
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

  static get_all(cb)
  {
    db.all("select * from Users", cb);
  }

  static delete(login, cb)
  {
    const sql = "DELETE FROM Users WHERE login=?";
    db.run(sql, login, cb);
  }
}

class Record {
  static find(login, rate_id, cb)
  {
    db.get("SELECT * FROM Records WHERE login=? AND rate_id=?", login, rate_id, cb);
  }
  static get_all(cb)
  {
    db.all("SELECT * FROM Records", cb);
  }
  static findbyLogin(login, cb)
  {
    db.all("SELECT * FROM Records WHERE login=?", login, cb);
  }
  static add(login, rate_id, first_date, last_date, cb)
  {
    db.run("insert into Records(login, rate_id, first_date, last_date) values(?, ?, ?, ?);", login, rate_id, first_date, last_date, cb);
  }
  static update(login, rate_id, first_date, last_date, new_rate_id, cb)
  {
    db.run("update Records set rate_id=?, first_date=?, last_date=? where login=? and rate_id=?", new_rate_id, first_date, last_date, login, rate_id, cb);
  }
  static delete(login, rate_id, cb)
  {
    db.run("delete from Records where login=? and rate_id=?", login, rate_id, cb);
  }
  static deletebyLogin(login, cb)
  {
    db.run("delete from Records where login=?", login, cb);
  }
}

class Room {
  static findbyID(id, cb)
  {
    const sql = "select * from Rooms where id = ?";
    db.get(sql, id, cb);
  }
}

class Rate {
  static find(room, with_breakfast, cb)
  {
    const sql = "select * from Rates where room_id = ? and with_breakfast = ?";
    db.get(sql, room, with_breakfast, cb);
  }
  static findbyID(id, cb)
  {
    const sql = "select * from Rates where id = ?";
    db.get(sql, id, cb);
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
        if (fs.existsSync(__dirname+"/avatars/"+login+".jpg"))
          {
            fs.unlinkSync(__dirname+"/avatars/"+login+".jpg");
          }
        Record.deletebyLogin(login, (err, rec)=>{});
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

app.get('/reservation:id', (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  User.findbyLogin(login, (err, user)=>
  {
    console.log(login);
    if (!err && user)
    {
      res.render("reservation.ejs", {"login": login})
      
    }
  });
  
});

app.get('/booking/:id/:room/:with_breakfast/:date_first/:date_last/:adults_count/:children_count', (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  let room = req.params.room.slice(1, req.params.room.length);
  let with_breakfast = req.params.with_breakfast.slice(1, req.params.with_breakfast.length);
  let date_first = req.params.date_first.slice(1, req.params.date_first.length).replace('-', '/');
  let date_last = req.params.date_last.slice(1, req.params.date_last.length).replace('-', '/');
  let adults_count = req.params.adults_count.slice(1, req.params.adults_count.length);
  let children_count = req.params.children_count.slice(1, req.params.children_count.length);
  let nights_count = Math.round((new Date(date_last) - new Date(date_first)) / (1000 * 60 * 60 * 24));
  let rate;
  if (with_breakfast)
    rate="Тариф с завтраком";
  else rate = "Тариф без завтрака";
  let room_name = ["Президентский", "Премиум", "Люкс", "Бизнес-класс", "Минимализм"][parseInt(room)-1];

  console.log(date_first);
  Room.findbyID(room, (err, r)=>{
    if (!err && r)
      {
        Rate.find(r.room_id, with_breakfast, (err, rs)=>{
          res.render("booking.ejs", {"price": rs.price_for_night, "dirname": "http://localhost:3000/", "login": login, "img_part": `img src=/avatars/${login}.jpg`,
          "room": room_name, "date_first": date_first, "date_last": date_last, "nights_count": nights_count, "adults_count": adults_count, "children_count": children_count,
          "rate": rate, "full_price": nights_count * rs.price_for_night, 'room_id' :  room, 'rate_bool' : with_breakfast
        });
        });
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
    User.findbyLogin(req.body.login, (err, user)=>{
      res.render('authorizated.ejs', {"password": user.password, "dirname": "http://localhost:3000/", login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
    });
});

app.post('/user_changed', (req, res, next) => {
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
  res.redirect('/users');
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

app.post('/booked/:id/:room/:rate/:date_first/:date_last', (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  let room = req.params.room.slice(1, req.params.room.length);
  let rate = req.params.rate.slice(1, req.params.rate.length);
  let date_first = req.params.date_first.slice(1, req.params.date_first.length);
  let date_last = req.params.date_last.slice(1, req.params.date_last.length);
  Rate.find(room, rate, (err, r)=>
  {
    
    if (!err && r)
      {
        Record.add(login, r.id, date_first, date_last, (err, rec)=>
        {
          console.log(err);
          User.findbyLogin(login, (err, user)=>{
            res.render("authorizated.ejs", {dirname: "http://localhost:3000/", login: login, password: user.password, img_part: `img src=/avatars/${login}.jpg`});
          });
          
        });
      }
  })
});

app.get("/records/:id/:number", (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  let number = req.params.number.slice(1, req.params.number.length);
  Record.findbyLogin(login, async (err, rec)=>
  {
    console.log("rec:", rec);
    if (!err && rec)
      {
        if (number != "0")
          {
            Record.delete(login, number, (err, res)=>{
            });
          }
        let records = [];
        let i = 0;
        for (const record of rec) {
          Rate.findbyID(record.rate_id, (err, rate)=>
          {
            i++;
            if (!err && rate && record.rate_id != number)
              {
                console.log(records);
                records.push([i+"", ["Президентский", "Премиум", "Люкс", "Бизнес-класс", "Минимализм"][parseInt(rate.room_id)-1],
                ["Тариф без завтрака", "Тариф с завтраком"][parseInt(rate.with_breakfast)], rate.price_for_night + " руб", record.rate_id, record.first_date, record.last_date
              ]);
                if (i == rec.length || number != "0" && i == rec.length-1)
                  {
                    User.findbyLogin(login, (err, user)=>{
                    res.render("records.ejs", {password: user.password, "records": records, "dirname": "http://localhost:3000/", login: login, img_part: `img src=/avatars/${login}.jpg`});
                    });
                  }
              }
          });
        }
        if (rec.length == 0 || rec.length == 1 && number != "0")
          {
            User.findbyLogin(login, (err, user)=>{
              res.render("records.ejs", {password: user.password, "records": records, "dirname": "http://localhost:3000/", login: login, img_part: `img src=/avatars/${login}.jpg`});
              });
          }
        console.log(records);
      }
  });
});

app.post("/change_record/:id/:rate_id/:room/:tariff/:date_first/:date_last", (req, res, next) => {

  let login = req.params.id.slice(1, req.params.id.length);
  let room = req.params.room.slice(1, req.params.room.length);
  let rate_id = req.params.rate_id.slice(1, req.params.rate_id.length);
  let tariff = req.params.tariff.slice(1, req.params.tariff.length);
  let date_first = req.params.date_first.slice(1, req.params.date_first.length);
  let date_last = req.params.date_last.slice(1, req.params.date_last.length);

  Rate.find(room, tariff, (err, rate)=>
  {
    if (!err && rate)
      {
        Record.update(login, rate_id, date_first, date_last, rate.id, (err, rec)=>
        {
          console.log(rate_id, rate.id);
        });
        setTimeout(()=>{
          Record.get_all(async (err, rec)=>
            {
              if (rec.length == 0)
                {
                  User.findbyLogin(login, (err, user)=>{
                    res.render("admin.ejs", {password: user.password, "records": [], "dirname": "http://localhost:3000/", login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
                    });
                  return true;
                }
              console.log("rec:", rec);
              if (!err && rec)
                {
                  let records = [];
                  let i = 0;
                  for (const record of rec) {
                    Rate.findbyID(record.rate_id, (err, rate)=>
                    {
                      i++;
                      if (!err && rate)
                        {
                          console.log(records);
                          records.push([record.id, record.login, ["Президентский", "Премиум", "Люкс", "Бизнес-класс", "Минимализм"][parseInt(rate.room_id)-1],
                      ["Тариф без завтрака", "Тариф с завтраком"][parseInt(rate.with_breakfast)], rate.price_for_night + " руб", record.rate_id, record.first_date, record.last_date
                    ]);
                          if (i == rec.length)
                            {
                              records.sort(function (a, b) {
                                if (parseInt(a[0]) < parseInt(b[0]))
                                  return -1;
                                return 1;
                              });
                              User.findbyLogin(login, (err, user)=>{
                              res.render("admin.ejs", {"records": records, "dirname": "http://localhost:3000/", password: user.password, login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
                              });
                            }
                        }
                    });
                  }
                  console.log(records);
                }
            });
        }, 100);
      }
  })
});

app.post("/change_record_user/:id/:rate_id/:room/:tariff/:date_first/:date_last", (req, res, next) => {

  let login = req.params.id.slice(1, req.params.id.length);
  let room = req.params.room.slice(1, req.params.room.length);
  let rate_id = req.params.rate_id.slice(1, req.params.rate_id.length);
  let tariff = req.params.tariff.slice(1, req.params.tariff.length);
  let date_first = req.params.date_first.slice(1, req.params.date_first.length);
  let date_last = req.params.date_last.slice(1, req.params.date_last.length);

  Rate.find(room, tariff, (err, rate)=>
  {
    if (!err && rate)
      {
        Record.update(login, rate_id, date_first, date_last, rate.id, (err, rec)=>
        {
          console.log(rate_id, rate.id);
        });
        setTimeout(()=>{
          Record.findbyLogin(login, async (err, rec)=>
            {
              if (rec.length == 0)
                {
                  User.findbyLogin(login, (err, user)=>{
                    res.render("records.ejs", {password: user.password, "records": [], "dirname": "http://localhost:3000/", login: login, img_part: `img src=/avatars/${login}.jpg`});
                    });
                  return true;
                }
              console.log("rec:", rec);
              if (!err && rec)
                {
                  let records = [];
                  let i = 0;
                  for (const record of rec) {
                    Rate.findbyID(record.rate_id, (err, rate)=>
                    {
                      i++;
                      if (!err && rate)
                        {
                          console.log(records);
                          records.push([record.id, ["Президентский", "Премиум", "Люкс", "Бизнес-класс", "Минимализм"][parseInt(rate.room_id)-1],
                      ["Тариф без завтрака", "Тариф с завтраком"][parseInt(rate.with_breakfast)], rate.price_for_night + " руб", record.rate_id, record.first_date, record.last_date
                    ]);
                          if (i == rec.length)
                            {
                              records.sort(function (a, b) {
                                if (parseInt(a[0]) < parseInt(b[0]))
                                  return -1;
                                return 1;
                              });
                              User.findbyLogin(login, (err, user)=>{
                              res.render("records.ejs", {password: user.password, "records": records, "dirname": "http://localhost:3000/", login: login, img_part: `img src=/avatars/${login}.jpg`});
                              });
                            }
                        }
                    });
                  }
                  console.log(records);
                }
            });
        }, 100);
      }
  })
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
        fs.writeFile(`${__dirname}/avatars/${req.body.login}.jpg`, buffer, (err) => 
          console.log(err));
      }
    }

    download();
    res.render('authorizated.ejs', {dirname: "http://localhost:3000/", login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`, password: req.body.password});
  });
});

app.post('/entered', (req, res, next) => {
  console.log(69);
  User.find(req.body.login, req.body.password, (err, user) => {
    if (err || user == undefined) {
      res.render('index.ejs', {error: "error"});
      return false;
    }
    if (req.body.login == "admin")
    {
      Record.get_all(async (err, rec)=>
        {
          if (rec.length == 0) {
            User.findbyLogin(req.body.login, (err, user)=>{
            res.render("admin.ejs", {"records": [], "dirname": "http://localhost:3000/", password: user.password, login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
            });
            return true;
          }
          console.log("rec:", rec);
          if (!err && rec)
            {
              let records = [];
              let i = 0;
              for (const record of rec) {
                Rate.findbyID(record.rate_id, (err, rate)=>
                {
                  i++;
                  if (!err && rate)
                    {
                      console.log(records);
                      records.push([record.id, record.login, ["Президентский", "Премиум", "Люкс", "Бизнес-класс", "Минимализм"][parseInt(rate.room_id)-1],
                      ["Тариф без завтрака", "Тариф с завтраком"][parseInt(rate.with_breakfast)], rate.price_for_night + " руб", record.rate_id, record.first_date, record.last_date
                    ]);
                      if (i == rec.length)
                        {
                          User.findbyLogin(req.body.login, (err, user)=>{
                            res.render("admin.ejs", {"records": records, "dirname": "http://localhost:3000/", password: user.password, login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
                            });
                        }
                    }
                });
              }
              console.log(records);
            }
        });
    }
    else {
      res.render('authorizated.ejs', {dirname: "http://localhost:3000/", login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`, "password": req.body.password});
    }
  });
});


app.get("/admin_delete/:id/:number", (req, res, next)=>
{
  let login = req.params.id.slice(1, req.params.id.length);
  let number = req.params.number.slice(1, req.params.number.length);
  Record.delete(login, number, (err, res)=>{
  });
  setTimeout(()=> {
    Record.get_all(async (err, rec)=>
      {
        if (rec.length == 0)
          {
            res.render("admin.ejs", {"records": [], "dirname": "http://localhost:3000/", login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
            return true;
          }
        console.log("rec:", rec);
        if (!err && rec)
          {
            let records = [];
            let i = 0;
            for (const record of rec) {
              Rate.findbyID(record.rate_id, (err, rate)=>
              {
                i++;
                if (!err && rate)
                  {
                    console.log(records);
                    records.push([record.id, record.login, ["Президентский", "Премиум", "Люкс", "Бизнес-класс", "Минимализм"][parseInt(rate.room_id)-1],
                    ["Тариф без завтрака", "Тариф с завтраком"][parseInt(rate.with_breakfast)], rate.price_for_night + " руб", record.rate_id, record.first_date, record.last_date
                  ]);
                    if (i == rec.length)
                      {
                        records.sort(function (a, b) {
                          if (parseInt(a[0]) < parseInt(b[0]))
                            return -1;
                          return 1;
                        });
                        res.render("admin.ejs", {"records": records, "dirname": "http://localhost:3000/", login: req.body.login, img_part: `img src=/avatars/${req.body.login}.jpg`});
                      }
                  }
              });
            }
            console.log(records);
          }
      });
  }, 100);
});

app.get("/users", (req, res, next) => {
  User.get_all((err, users)=>
  {
    if (!err && users)
      {
        let non_admin_users = [];
        users.forEach(user=>{
          if (user.login != "admin")
            {
              non_admin_users.push(user);
            }
        })
        res.render("users.ejs", {"users": non_admin_users, "dirname": "http://localhost:3000/"});
      }
  }
);
  
});

app.post("/other:page", (req, res, next) => {
  let page = req.params.page.slice(1, req.params.page.length);
  let login = req.body.login;
  let password = req.body.password;
  res.render(page+".ejs", {"login": login, "password": password, dirname: "http://localhost:3000/"});
});

app.post("/admin_change_user:id", (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  User.findbyLogin(login, (err, user)=>
    {
      console.log(login);
      if (!err && user)
      {
        res.format({ 
          html: () => {
            res.render("admin_change_user.ejs", {"name": user.name, "surname": user.surname, "lastname": user.lastname, "phone": user.phone_number, "passport": user.passport_info, "login":login, "password": user.password, "path": "avatars/"+user.path})
    
          },
          json: () => {
          
          }
          });
      }
    });
  
});

app.post("/admin_delete_user:id", (req, res, next) => {
  let login = req.params.id.slice(1, req.params.id.length);
  User.findbyLogin(login, (err, user)=>
    {
      console.log(login);
      if (!err && user)
      {
        User.delete(login, ()=>{
          if (fs.existsSync(__dirname+"/avatars/"+login+".jpg"))
            {
              fs.unlinkSync(__dirname+"/avatars/"+login+".jpg");
            }
          Record.deletebyLogin(login, (err, rec)=>{});
          res.format({ 
            html: () => {
            res.redirect("/users");
      
            },
            json: () => {
            
            }
            });
        })
        
      }
    });
  });

app.listen(app.get('port'), () => {
  console.log("App started on port", app.get('port'));
})

