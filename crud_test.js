#!/usr/bin/env node

var mongoose = require('mongoose');
var assert = require('assert');
var cfenv = require("cfenv");

// Compose MongoDB 接続情報のセットアップ
var svc = 'compose-for-mongodb';
var vcapLocal = require("./vcap-local.json");
var appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {};
var appenv = cfenv.getAppEnv(appEnvOpts);
var services = appenv.services;
var mongodb_services = services["compose-for-mongodb"];
var credentials = mongodb_services[0].credentials;
var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];
var options = {
    mongos: {
	ssl: true,
	sslValidate: true,
	sslCA: ca,
	poolSize: 1,
	reconnectTries: 1
    }
};

// エラー時のコールバック
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
  process.exit(0);
});

// セッション確立
mongoose.connection.on('open', function (err) {
    var async = require('async');
    var User = require('./models/user');

    async.series([
       // CREATE
       function(callback) {
           // ユーザデータ
           var userData = {
               name: 'ごま',
               username: 'gomagoma',
               password: 'hogehoge' 
           };
           var userClass = new User(userData);

           // カスタムのメソッドを呼んで、名前の後ろに文字列を追加
           name = userClass.dudify();
           console.log('あなたの名前は ' + name);

           // 保存
           userClass.save(function(err) {
         　    if (err) throw err;
               console.log("登録");
               callback(null);
           });
       },
       // READ
       function(callback) {
           query = { username: 'gomagoma' }
           User.find( query, function(err, user) {
               if (err) throw err;
               console.log("user = ", user);
               callback(null);
           });
       },
       // UPDATE
       function(callback) {
           var query = { username: 'gomagoma' }
           var new_doc = { username: 'gomagoma', password: 'damedame' }
           User.update(query, new_doc, function(err) {
               if (err) throw err;
               console.log('更新完了');
               callback(null);
           });
       },
       // READ
       function(callback) {
           query = { username: 'gomagoma' }
           User.find( query, function(err, user) {
               if (err) throw err;
               console.log("user = ", user);
               callback(null);
           });
       },
       // DELETE
       function(callback) {
           User.remove({ username: 'gomagoma' }, function(err, user) {
               if (err) throw err;
               console.log('削除成功');
               callback(null);
           });
       },
       // READ
       function(callback) {
           query = { username: 'gomagoma' }
           User.find( query, function(err, user) {
               if (err) throw err;
               console.log("user = ", user);
               callback(null);
           });
       }],
       // CLOSE
       function(err) {
           console.log("end");
	   mongoose.connection.db.close();
       }
    );
});

// MondoDBと接続
mongoose.connect(credentials.uri, options);


