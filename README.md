# midoritei-E-team
test
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

## API 仕様書
- 作成者: 株式会社 MSC
- Ver: 2.1.0
- 作成日: 2025/12/19
- 更新日: 2026/02/02

### 1. 目的
この API は、モバイルオーダーシステム（MOS）からレジシステムへ注文情報を連携するためのインターフェースです。

### 2. 共通仕様
- 通信方式: HTTP
- メソッド: POST
- エンドポイント: /api/orders
- データ形式: JSON
- 文字コード: UTF-8

#### 共通ヘッダー
- Content-Type: application/json
- Accept: application/json

### 3. API 一覧
| API名 | メソッド | パス | method値 | 概要 |
| --- | --- | --- | --- | --- |
| 注文取得 API | POST | /api/orders | getOrders | 受付中の注文データを取得する |
| 会計状況更新 API | POST | /api/orders | updateStatus | 注文の会計状況を更新する |

### 4. 注文取得 API（getOrders）
#### 4.1 リクエスト内容
| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| method | string | ○ | 固定値: getOrders |
| customerId | string | - | 指定するとその顧客の注文のみ取得 |
| billStatus | int | - | 会計状況の絞り込み |
| fromTime | string | - | 取得開始日時 |
| toTime | string | - | 取得終了日時 |

#### 4.2 リクエスト例
```json
{
  "method": "getOrders",
  "customerId": "0000001",
  "billStatus": 15,
  "fromTime": null,
  "toTime": "2025-11-25T01:00:00"
}
```

#### 4.3 レスポンス例
```json
[
  {
    "hash": "0c192fff778a2d4c78b68599c3c4658418359d117e7c903feb46c9ef2112752e",
    "storeId": "AA",
    "entryTime": "2025-11-24T19:12:00",
    "customerId": "0000001",
    "billStatus": 1,
    "items": [
      {
        "menuName": "瓶ビール",
        "unitPrice": 600,
        "taxRate": 10,
        "orderQty": 2,
        "offerQty": 2,
        "categoryName": "ビール"
      }
    ]
  }
]
```

### 5. 会計状況更新 API（updateStatus）
#### 5.1 リクエスト内容
| 項目 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| method | string | ○ | 固定値: updateStatus |
| customerId | string | ○ | 対象顧客 ID |
| hash | string | - | 同一性判定用ハッシュ |
| billStatus | int | ○ | 更新後の会計状況 |

#### 5.2 リクエスト例
```json
{
  "method": "updateStatus",
  "customerId": "0000001",
  "hash": null,
  "billStatus": 8
}
```

#### 5.3 レスポンス
正常時はレスポンスボディを空にします。

### 6. billStatus の意味
| 値 | 意味 |
| --- | --- |
| 1 | 受付中 |
| 2 | 会計済み |
| 4 | 未収金 |
| 8 | 会計中 |

### 7. エラーコード
- 4xx: リクエスト内容に問題がある場合
- 5xx: サーバー側でエラーが発生した場合
- 命名規則: UPPER_SNAKE_CASE

#### 例
```json
{
  "errorCode": "INVALID_JSON_FORMAT",
  "message": "The request format is invalid."
}
```

### 8. 補足
- 主要な開発対象は注文取得と会計状況更新です。
- 実装時は、JSON のキー名と型を一致させてください。

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
##イルカマン最強