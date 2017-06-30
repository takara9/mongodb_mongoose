var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// スキーマの作成
var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    location: String,
    meta: {
       age: Number,
       website: String
    },
    created_at: Date,
    updated_at: Date
});


// カスタム・メソッド  名前の後ろに文字列をつける
userSchema.methods.dudify = function() {
    console.log("カスタム・メソッド");
    this.name = this.name + 'ちゃん'; 
    return this.name;
};


// Saveが実行される都度、事前に実行
userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
       this.created_at = currentDate;
    next();
});

// モデルの作成
var User = mongoose.model('User', userSchema);


// 呼び出し元へ作成したモデルが利用できる様にする
module.exports = User;
