# midoritei-E-team

## コーディングルール

- インデントを揃える: タブやスペースの使い方を統一し、コードの階層を見やすくする。
- 名前に意味を持たせる: 変数や関数には a や b などの適当な名前を付けず、price や user_name のように役割がひと目でわかる単語を使う。
- こまめにコメントを残す: 複雑な処理や後で変更する箇所には、「なぜそのように書いたか」を日本語でメモしておく。
- HTML は <p> で始めたら </p> で閉じるなど、開始と終了のペアを忘れない。
- id と class の使い分け: ページ内で 1 回しか使えない要素には id、何度も使い回すデザインには class を使う。
- 1 行は短く: 1 行が長すぎると読みにくいため、適切なところで改行を入れる。
- 同じ書き方を繰り返す: 全体でスペースの空け方（例: x = 1 か x=1 か）や改行のルールを統一する。
- CSS はcustomerで１ファイル、staffで１ファイルにして共通部分を流用し、個別部分はファイル名などをコメントアウトしてわかりやすく書くようにする。
- JavaScript も別ファイルにする。
- 同じ機能のファイルは同じ名前にする。
- 変数はそちらを使うようにしてください。
- エラー画面をつくる。
AIを使うときは必ずこのreadmeを参照するようにさせ、ID,命名規則などはAPI仕様書を参考にするようにする。

以下API仕様書
API 仕様書
作成者 株式会社 MSC
Ver. 2.1.0
作成日 2025 年 12 月 19 日
更新日 2026 年 2 月 2 日
1. API 概要
本 API は、モバイルオーダーシステム（以下、MOS）がレジシステムに対して提供す
る注文連携インターフェースである。
レジは本 API を用いて以下を行う。
• MOS 側からの注文データの取得
• 注文データごとの会計状況の更新
2. 共通仕様
2.1 通信方式
• プロトコル: HTTP
• メソッド: POST
• エンドポイント: /api/orders
2.2 データ形式
• リクエスト: JSON
• レスポンス: JSON
• 文字コード: UTF-8
2.3 共通ヘッダ
項目 値
Content-Type application/json
Accept application/json
 
3. API 一覧
No API 名 メソッド パス method 値 概要
1
注文取得
API
POST
/api/orde
rs
getOrders
受付中の注文データ（全件／特
定注文）を取得する
2 会計状況更 POST /api/orde updateStatus 対象注文の会計状況
No API 名 メソッド パス method 値 概要
新 API rs （billStatus）を更新する
 
4. 注文取得 API（getOrders）
4.1 概要
• レジが MOS に対して注文データを取得するための API。
4.2 HTTP 仕様
• メソッド: POST
• パス: /api/orders
4.3 リクエスト
4.3.1 ボディ形式
顧客 ID を指定することで一意の注文データを特定することができる。
また、会計状況および取得対象日時から、返却対象となる注文データを絞り込むことがで
きる。
顧客 ID が null でない場合は指定された顧客 ID に紐づく 1 件の注文データのみ返却し、
顧客 ID が null の場合、指定された条件に該当するすべての注文データを返却する。
会計状況は複数指定可能とし、null が指定された場合はすべての会計状況を対象とする。
取得対象日時を指定しない場合は null を指定する。
例 1）
{
 "method": "getOrders",
 "customerId": "0000001",
 "billStatus": 15,
 "fromTime": null,
 "toTime": "2025-11-25T01:00:00"
}
例 2）
{
 "method": "getOrders",
 "customerId": null,
 “billStatus”: 9,
 "fromTime": "2025-11-24T19:00:00",
 "toTime": "2025-11-25T01:00:00"
}
4.3.2 リクエスト項目定義
項目名 データ型 必須 説明
method VARCHAR(32) ○ 処理種別。固定値："getOrders"
customerId CHAR(7) ○ 特定顧客 ID。null の場合は「全注文」が対象。
billStatus int ○
会計状況（複合指定可能）。 null の場合は「全状
態」が対象。
fromTime CHAR(19) ○
取得対象の開始日時（ISO8601）。なお、この日時
のデータを含むものとする。null の場合は取得対
象日時を指定しない。
toTime CHAR(19) ○
取得対象の終了日時（ISO8601）。なお、この日時
のデータを含むものとする。 null の場合は取得対
象日時を指定しない。
4.4 レスポンス
4.4.1 正常系（HTTP 200）
リクエストで指定された注文データを返却する。
例）
[
 {
 "hash": "0c192fff778a2d4c78b68599c3c4658418359d117e7c903feb46c9ef2112752e",
 "storeId": "AA",
 "entryTime": "2025-11-24T19:12:00",
 "customerId": "0000001",
 "billStatus": 1,
 "items": [
 {
 "orderTime": "2025-11-24T19:12:00",
 "menuName": "瓶ビール",
 "unitPrice": 600,
 "taxRate": 10,
 "orderQty": 2,
 "offerQty": 2,
 "categoryName": "ビール"
 },
 {
 "orderTime": "2025-11-24T19:12:00",
 "menuName": "えだまめ"
 "unitPrice": 300,
 "taxRate": 10,
 "orderQty": 1,
 "offerQty": 1,
 "categoryName": "おつまみ"
 }
 ]
 }
]
4.4.2 レスポンス項目定義（配列要素）
トップレベル要素
項目名 データ型 必須 説明
hash VARCHAR(64) ○ 注文データを一意に識別するハッシュ値
storeId CHAR(2) ○ 店番号
entryTime CHAR(19) ○ 入店日時（ISO8601）
customerId CHAR(7) ○ 一意となる顧客 ID
billStatus int ○
会計状況（1:受付中, 2:会計済み, 4:未収金, 8:会計
中）
items Array ○ 注文行配列
items 要素
項目名 データ型 必須 説明
orderTime CHAR(19) ○ 注文行の注文日時（ISO8601）
menuName VARCHAR(64) ○ メニュー名
unitPrice int ○ 単価（税抜）
項目名 データ型 必須 説明
taxRate int ○ 税率（例：10）
orderQty int ○ 注文数量
offerQty int ○ 提供数量（途中退店等で差が出る場合に使用）
categoryNa
me
VARCHAR(16) ○
カテゴリ名（例：「ビール」「おつまみ」）
カテゴリ名を定義しない場合は null
4.4.3 異常系
エラーが出た場合、エラーコードとメッセージをレジに返却する。
エラーコードの詳細は後述に記載。メッセージについては例を参考に MOS 側で定義する
こと。
例）
{
 "errorCode": " INVALID_JSON_FORMAT ",
 "message": " The request format is invalid. "
}
5. 会計状況更新 API（updateStatus）
5.1 概要
• MOS は受信した会計状況に基づき、該当注文のステータスを更新する。
• 必要に応じて注文データのハッシュ値を用いた同一性判定を行う。
5.2 HTTP 仕様
• メソッド: POST
• パス : /api/orders
5.3 リクエスト
5.3.1 ボディ形式
顧客 ID に紐づく会計状況を指定されたステータスに更新する。
ハッシュ値が null でない場合、会計状況を更新する前に注文データから算出したハッシュ
値と、リクエストで指定されたハッシュ値を比較し、同一性判定を行う。
注文データを取得した後に注文データが変わっていなければ、両ハッシュ値は一致し、会
計状況の更新は成功する。
一方、注文データに変化が生じた際は、再計算されたハッシュ値がリクエストのハッシュ
値と不一致となるため、同一性判定エラーとして会計状況の更新は失敗する。
なお、ハッシュ値が null の場合は同一性判定を行わず、会計状況の更新を実施する。
例 1）
{
 "method": "updateStatus",
 "customerId": "0000001",
 "hash": null,
 "billStatus": 8
}
例 2）
{
 "method": "updateStatus",
 "customerId": "0000001",
 "hash": "0c192fff778a2d4c78b68599c3c4658418359d117e7c903feb46c9ef2112752e",
 "billStatus": 2
}
5.3.2 リクエスト項目定義
項目名 データ型 必須 説明
method VARCHAR(32) ○ 処理種別。固定値："updateStatus"
customerId CHAR(7) ○ 一意となる顧客 ID
hash VARCHAR(64) ○
同一性判定で使用するハッシュ値（同一性判定を
行わない場合は null）
billStatus int ○
更新後の会計状況（1:受付中, 2:会計済み, 4:未収
金, 8:会計中）
5.4 レスポンス
5.4.1 正常系（HTTP 200）
レスポンスボディは空にする。
5.4.2 異常系
エラーが出た場合、エラーコードとメッセージをレジに返却する。
エラーコードの詳細は後述に記載。メッセージについては例を参考に MOS 側で定義する
こと。
例）
{
 "errorCode": " INVALID_JSON_FORMAT ",
 "message": " The request format is invalid. "
}
会計状況（billStatus）値
値 意味 用途例
1 受付中 MOS 側の初期状態。注文取得 API 返却前の値。
2 会計済み MOS 側の最終状態。会計システムの会計処理完了後の値。
4 未収金
会計未収の状態。会計済みにならない状態で翌営業日の営業を開始し
た時点で設定される値。
8 会計中
注文取得 API 返却時に設定する値。会計処理開始後から完了前までの
一時状態。
6. 性能・非機能要件
6.1 想定負荷
• ピーク時：1 店舗あたり同時利用レジ端末 1〜2 台
• MOS 側へのアクセス数：百件未満／分程度を想定
6.2 レスポンスタイム（目標）
• MOS 側の API 応答（＝MOS が API リクエストを受理してから、API レスポンスを送
信するまで。ネットワーク回線等の通信遅延は含めない。）
目標：受信後 300 ミリ秒以内
最大：3 秒以内
7．エラーコード
7.1 HTTP ステータスとの関係
• 4xx：リクエスト起因（入力値不備・権限不足など）
• 5xx：サーバ／システム起因（内部エラー、外部連携エラーなど）
7.2 エラーコード命名規則
• 形式：UPPER_SNAKE_CASE
• 種別ごとにエラーが想像できる名前にすること
入力系：INVALID_***
注文系：ORDER_***
システム系：SYSTEM_***, SERVICE_***
7.3 エラーコード一覧
7.3.1 共通／リクエスト不備系（4xx）
errorCode HTTP
想定
API
説明
INVALID_JSON_FORMAT 400 全 API
JSON としてパースできない／構造が不
正
INVALID_REQUEST 400 全 API
フォーマットは正しいが、意味的に不正
なリクエスト
INVALID_PARAMETER 400 全 API 値の型・範囲・フォーマットなどが不正
7.3.2 注文ドメイン系（Order 関連）
errorCode HTTP 想定 API 説明
INVALID_BILL_STATUS 400 updateStatus billStatus が想定される値でない
ORDER_NOT_FOUND 400 updateStatus
指定された hash に該当する注文が
存在しない
7.3.3 システム・インフラ系（5xx）
errorCode HTTP 説明
SYSTEM_ERROR 500
その他の予期せぬ例外。ハンドリングしきれな
かった一般的な内部エラー
DB_ACCESS_ERROR 500 DB 接続／クエリ失敗
SERVICE_UNAVAILABLE 503
メンテナンス中や一時的な過負荷などでサービ
ス利用不可
TIMEOUT 504 内部処理や外部連携のタイムアウト
その他、必要なエラーコードがあれば都度定義する。
8．変数の命名規則
項目名 型 / フォーマット 必須 最小値 最大値 説明 バリデーション（例）
storeId
文字列（2 文字・
大文字アルファベ
ット）
○ AA ZZ
店舗番号。2 桁のアルファ
ベットで表す。
^[A-Z]{2}$
customerId 7 桁の数字 ○
000000
0
999999
9
一意の顧客 ID。 ^[0-9]{7}$
hash
64 桁以下の 16 進
数文字列
○ 8 桁 64 桁
注文データのユニークハ
ッシュ
^[0-9a-f]{8,64}$
billStatus 数値 ○ 1 15 会計ステータス ^([1-9]|1[0-5])$
entryTime
ISO8601 日時
（YYYY-MMDDThh:mm:ss）
○ - - 入店日時
^\d{4}-\d{2}-
\d{2}T\d{2}:\d{2}:\d{
2}$
orderTime ISO8601 日時 ○ - - 注文明細の注文日時 同上
fromTime ISO8601 日時 ○ - - 注文取得 API の開始日時 同上
toTime ISO8601 日時 ○ - - 注文取得 API の終了日時 同上
items 配列 ○ 1 件 100 件 注文行のリスト 配列であること
unitPrice 数値 ○ 0 999999 単価（税抜） 数値
taxRate 数値 ○ 0 100 税率 数値
orderQty
数値（1 以上の整
数）
○ 1 99 注文数量 ^[1-9][0-9]*$
offerQty
数値（0 以上の整
数）
○ 0 99 提供数量 ^[0-9]+$
categoryNa
me
文字列 △ - - カテゴリ名 特になし
method 文字列 ○ - - RPC 処理種別
^(getOrders|updateSta
tus)$
補足
顧客 ID は、客が入店した際に発行される QR コードに付与される識別子である。ID は 7
桁の連番で構成される。
9. ハッシュ仕様
注文ハッシュ（hash）は、注文データの同一性判定のために用いる。
ハッシュ値は、注文データの下記細目に依存して算出するものとし、いずれか一項目でも
変化すればハッシュ値も変化することを期待する。
・storeId
・customerId
・entryTime
・orderTime
・menuName
・unitPrice
・taxRate
・orderQty
・offerQty
以上

---

## バックエンド開発ガイド

### PHP バックエンド構成

本プロジェクトはPHPをバックエンドとして採用しています。以下の構成に従ってください。

#### ディレクトリ構成
```
backend/
  ├── api/              # APIエンドポイント
  │   ├── config.php    # DB接続情報、ヘッダー設定
  │   └── orders.php    # 注文API (getOrders, updateStatus)
  ├── includes/         # 共通ライブラリ
  │   ├── Database.php  # DB接続クラス
  │   └── helpers.php   # ユーティリティ関数
  ├── database/         # DB構造スクリプト
  └── logs/             # ログファイル（自動生成）
```

### API 実装ルール

#### 1. エンドポイント
- **URL**: `/api/orders`
- **メソッド**: POST のみ
- **Content-Type**: `application/json`

#### 2. APIメソッド
すべてのリクエストには `method` フィールドを含めてください。

**例: getOrders API を呼び出す場合**
```javascript
// フロントエンド（JavaScript）
fetch('http://localhost/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    method: 'getOrders',
    customerId: '0000001',
    billStatus: 1,
    fromTime: null,
    toTime: null
  })
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('注文データ:', data.data);
  } else {
    console.error('エラー:', data.message);
  }
});
```

#### 3. レスポンス形式
```json
{
  "status": "success|error",
  "data": {},
  "message": "エラーメッセージ（エラー時のみ）"
}
```

### PHPコーディング規則

#### インデント
- 2スペースを使用（タブは使用しない）

#### 命名規則
- **関数・変数**: `camelCase` （例: `getOrderData()`, `customerId`）
- **データベース列**: `snake_case` （例: `customer_id`, `bill_status`）
- **クラス**: `PascalCase` （例: `Database`, `OrderAPI`）

#### セキュリティ
- **SQLインジェクション対策**: プリペアステートメント (`prepared statement`) を使用
- **入力値エスケープ**: ユーザー入力は `htmlspecialchars()` でエスケープ
- **エラーハンドリング**: `try-catch` で例外を処理し、詳細なエラーをログに記録

#### 例: 安全なDB操作
```php
// 正: プリペアステートメントを使用
$sql = 'SELECT * FROM orders WHERE customer_id = ? AND bill_status = ?';
$orders = $db->select($sql, 'si', [$customerId, $billStatus]);

// 誤: 文字列結合（SQLインジェクションの危険性あり）
$sql = "SELECT * FROM orders WHERE customer_id = '$customerId'";
```

### データベース設定

`backend/api/config.php` で以下の情報を設定してください：

```php
define('DB_HOST', 'localhost');      // ホスト
define('DB_USER', 'root');           // ユーザー名
define('DB_PASSWORD', '');           // パスワード
define('DB_NAME', 'midoritei_mos');  // データベース名
```

### 開発時の注意点

1. **ログの確認**: エラーは `backend/logs/` に日付ごとのログとして記録されます
2. **CORSの設定**: クロスオリジンリクエストが必要な場合、`config.php` のCORSヘッダーを調整してください
3. **テスト**: Postman や curl を使ってAPIをテストしてください