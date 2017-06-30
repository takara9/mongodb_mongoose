# Compose MongoDB へ接続するためのテストプログラム


# ファイルの説明

connection_test.js     接続テスト用
crud_test.js           CRUDテスト用
vcap-local.json.sample サービス資格情報


# 利用法
ファイル名を変更して.sampleを削除します。

~~~
mv vcap-local.json.sample ovcap-local.json 
~~~

Bluemix Compose MongoDB の サービス資格情報を参照しながら
vcap-local.json のcredentialsの中身を編集します。


接続テストでは、エラーが出なければ正常終了です。

~~~
node ./connection_test.js
~~~

# 実行例


**接続成功時の実行結果**
ワーニングが出る事もありますが、データが入っていれば、次の様なJOSN形式のデータが表示されます。

~~~
imac:mongodb_mongoose maho$ ./connection_test.js 
=== Connected to mongodb on Compose ===
{ name: 'messages', options: {} }
~~~


**エラー発生時の実行結果**
暗号化通信が出来なかった場合など、次のメッセージが表示されます。

~~~
imac:mongodb_mongoose maho$ ./connection_test.js 
Mongoose default connection error: MongoError: no mongos proxy available
~~~



**CRUDテストの実行結果**


~~~
imac:mongodb_mongoose maho$ ./crud_test.js 
カスタム・メソッド
あなたの名前は ごまちゃん
登録
user =  [ { _id: 595638142fb9c7475207a5df,
    created_at: 2017-06-30T11:37:56.490Z,
    updated_at: 2017-06-30T11:37:56.490Z,
    name: 'ごまちゃん',
    username: 'gomagoma',
    password: 'hogehoge',
    __v: 0 } ]
更新完了
user =  [ { _id: 595638142fb9c7475207a5df,
    created_at: 2017-06-30T11:37:56.490Z,
    updated_at: 2017-06-30T11:37:56.490Z,
    name: 'ごまちゃん',
    username: 'gomagoma',
    password: 'damedame',
    __v: 0 } ]
削除成功
user =  []
end
~~~

