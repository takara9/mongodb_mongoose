#!/usr/bin/env node
/*
#
# Compose MongoDB と接続テスト プログラム
#   ローカル開発環境用
#
*/

var mongoose = require('mongoose');
var assert = require('assert');
var cfenv = require("cfenv");

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
});

// セッション確立時のコールバック
mongoose.connection.on('open', function (err) {
  console.log("=== Connected to mongodb on Compose ===" );
  assert.equal(null, err);
  mongoose.connection.db.listCollections().toArray(function(err, collections) {
     assert.equal(null, err);
     collections.forEach(function(collection) {
       console.log(collection);
     });
     mongoose.connection.db.close();
     process.exit(0);
  });
});

// MongoDBへの接続
mongoose.connect(credentials.uri, options);



