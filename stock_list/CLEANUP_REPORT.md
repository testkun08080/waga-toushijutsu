# Python データ収集スクリプト - 定数整理レポート

## 📊 分析概要

`stock_list/` ディレクトリ内の4つのPythonスクリプト（合計1204行）を分析し、**52箇所以上**のマジックナンバー、重複定数、ハードコードされた値を検出しました。

**分析対象ファイル:**
- `sumalize.py` (696行) - メインデータ収集スクリプト
- `get_jp_stocklist.py` (104行) - JPX株式リスト取得
- `combine_latest_csv.py` (282行) - CSV統合処理
- `split_stocks.py` (122行) - JSON分割ユーティリティ

---

## 🚨 優先度: 高 - 重複とマジックナンバー

### **1. API/ネットワーク設定 (9箇所)**

#### **🔴 重大 - タイムアウト値の重複:**
```python
# sumalize.py:83
response = requests.get(url, timeout=10)  # 10秒のハードコード

# sumalize.py:334
time.sleep(0.5)  # API再試行間の0.5秒待機

# sumalize.py:538
time.sleep(2)  # 株式処理間の2秒待機
```

**問題点:** 同じ待機時間が複数箇所に散在し、変更時に修正漏れのリスク

#### **🔴 重大 - URL のハードコード:**
```python
# get_jp_stocklist.py:55
url = "https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls"
```

**問題点:** JPXがURL変更時に即座に対応できない

**推奨:** 設定ファイルに外部化することで、URL変更時の対応を容易にする

---

### **2. ファイルシステム定数 (11箇所)**

#### **🔴 重大 - 郵便番号バリデーションの重複:**
```python
# sumalize.py:77
if len(postal_code) < 7:
    return None

# combine_latest_csv.py:77
if len(postal_code) < 7:
    return None
```

**影響:** 同じバリデーションロジックが2ファイルに重複、保守性が低下

#### **🟡 中 - ファイル名のハードコード:**
```python
# get_jp_stocklist.py
"tickers.xls"           # Line 61
"converted.xlsx"        # Line 66
"stocks_all.json"       # Line 100

# split_stocks.py
"stocks_all.json"       # Line 92 (重複!)
f"stocks_{i + 1}.json"  # Line 48 (パターン)
```

**影響:** ファイル名変更時に複数箇所の修正が必要

#### **🟡 中 - ディレクトリパスのハードコード:**
```python
# combine_latest_csv.py (3箇所以上)
"./Export"  # Lines 58, 185, 243

# sumalize.py (複数箇所)
"Export"    # Lines 538, 580
```

#### **🟡 中 - ファイル検索パターン:**
```python
# combine_latest_csv.py:58
pattern = "japanese_stocks_data_*.csv"
```

---

### **3. フォーマット・表示定数 (18箇所)**

#### **🟡 中 - 区切り文字列の大量重複:**

**`"=" * 60` の重複 (8箇所):**
```python
# sumalize.py
print("=" * 60)  # Lines 506, 523, 580, 599

# combine_latest_csv.py
print("=" * 60)  # Lines 25, 243, 267, 273
```

**`"=" * 80` の使用 (1箇所):**
```python
# sumalize.py:580
print("=" * 80)
```

**`"-" * 50` の重複 (5箇所):**
```python
# split_stocks.py
print("-" * 50)  # Lines 39, 56, 112, 114, 119
```

**影響合計:** 3ファイルで**14箇所**の重複パターン

#### **🟡 中 - 日時変換のマジックナンバー:**
```python
# sumalize.py:122-132
seconds_per_minute = 60     # Line 122
seconds_per_hour = 3600     # Line 125
```

**問題点:** 時間計算の定数が明示的でない

#### **🟡 中 - 数値フォーマット:**
```python
# sumalize.py:160
f"{code:04d}.T"  # ゼロパディング幅「4」がマジックナンバー

# combine_latest_csv.py:185
size_mb = total_size / (1024 * 1024)  # MB変換の計算式が重複
```

---

### **4. ビジネスロジック定数 (8箇所)**

#### **🟡 中 - 投資有価証券計算の閾値重複:**
```python
# sumalize.py:275
net_cash += investment_value * 0.7  # 70%係数

# sumalize.py:452
net_cash += investment_value * 0.7  # 同じ係数が再度出現(重複!)
```

**問題点:** ビジネスルールが複数箇所に散在、変更時の整合性リスク

#### **🟡 中 - デフォルトチャンクサイズ:**
```python
# split_stocks.py:20
default_chunk_size = 1000  # 1000社ごとに分割
```

#### **🟡 中 - 市場フィルター条件:**
```python
# get_jp_stocklist.py:86-88
"プライム（内国株式）"
"スタンダード（内国株式）"
"グロース（内国株式）"
```

**問題点:** 市場区分が変更された際の修正箇所が不明確

---

### **5. 優先度: 低 - フォーマット文字列 (6箇所以上)**

**🟢 低 - 日時フォーマット文字列の重複:**
- `sumalize.py` と `combine_latest_csv.py` で複数の `strftime` フォーマット
- 影響は小さいが、外部化により統一性向上

---

## 💡 提案: 設定ファイル構造

### **推奨案: Python設定ファイル** (`stock_list/config.py`)

JSONではなくPythonファイルを推奨する理由:
- ✅ ネイティブPythonインポート（JSONパースのオーバーヘッドなし）
- ✅ 型ヒントとIDE補完サポート
- ✅ 必要に応じてバリデーションロジック追加可能
- ✅ クラスベースの整理で可読性向上
- ✅ コメントとdocstringによるドキュメント化

```python
"""
株式データ収集パイプライン用の設定定数

このモジュールは、データ収集スクリプト全体で使用される
定数を一元管理します。
"""

class APIConfig:
    """API・ネットワーク関連の定数"""

    # タイムアウト設定
    TIMEOUT_SECONDS = 10
    """API リクエストのタイムアウト時間（秒）"""

    # レート制限
    RETRY_DELAY_SECONDS = 0.5
    """API再試行時の待機時間（秒）"""

    STOCK_DELAY_SECONDS = 2
    """株式データ取得間の待機時間（秒）"""

    # バリデーション
    POSTAL_CODE_MIN_LENGTH = 7
    """郵便番号の最小文字数"""


class DataSources:
    """外部データソースのURL"""

    JPX_URL = (
        "https://www.jpx.co.jp/markets/statistics-equities/misc/"
        "tvdivq0000001vg2-att/data_j.xls"
    )
    """JPX公式データのダウンロードURL"""


class FileSystem:
    """ファイルパスと命名規則"""

    # ディレクトリ
    EXPORT_DIR = "./Export"
    """CSVエクスポート先ディレクトリ"""

    # 一時ファイル
    TEMP_XLS_FILE = "tickers.xls"
    """JPXデータの一時XLSファイル名"""

    TEMP_XLSX_FILE = "converted.xlsx"
    """変換後の一時XLSXファイル名"""

    # マスターファイル
    MASTER_JSON_FILE = "stocks_all.json"
    """全株式データのマスターJSONファイル名"""

    SPLIT_JSON_PATTERN = "stocks_{}.json"
    """分割後のJSONファイル名パターン（{}に番号が入る）"""

    # 検索パターン
    CSV_SEARCH_PATTERN = "japanese_stocks_data_*.csv"
    """CSVファイル検索用のglobパターン"""


class Formatting:
    """表示・フォーマット関連の定数"""

    # 区切り文字
    SEPARATOR_EQUALS_SHORT = "=" * 60
    """短い区切り線（60文字）"""

    SEPARATOR_EQUALS_LONG = "=" * 80
    """長い区切り線（80文字）"""

    SEPARATOR_DASHES = "-" * 50
    """ダッシュ区切り線（50文字）"""

    # 時間変換
    SECONDS_PER_MINUTE = 60
    """1分あたりの秒数"""

    SECONDS_PER_HOUR = 3600
    """1時間あたりの秒数"""

    # 株式コードフォーマット
    STOCK_CODE_PADDING = 4
    """株式コードのゼロパディング桁数"""

    STOCK_CODE_SUFFIX = ".T"
    """株式コードのサフィックス（東京証券取引所）"""

    # ファイルサイズ変換
    BYTES_PER_MB = 1024 * 1024
    """1MBあたりのバイト数"""


class BusinessLogic:
    """ビジネスルールと閾値"""

    INVESTMENT_VALUATION_RATIO = 0.7
    """投資有価証券の評価係数（70%）"""

    DEFAULT_CHUNK_SIZE = 1000
    """株式リスト分割時のデフォルトチャンクサイズ"""

    MARKET_FILTERS = [
        "プライム（内国株式）",
        "スタンダード（内国株式）",
        "グロース（内国株式）",
    ]
    """対象とする市場区分のリスト"""
```

---

## 📝 実装例: Before/After

### **例1: sumalize.py のリファクタリング**

#### **Before（現在のコード）:**
```python
# Line 83: タイムアウトのハードコード
response = requests.get(url, timeout=10)

# Line 334: 待機時間のハードコード
time.sleep(0.5)

# Line 538: 待機時間のハードコード
time.sleep(2)

# Line 275: マジックナンバー
net_cash += investment_value * 0.7

# Line 77: バリデーションのマジックナンバー
if len(postal_code) < 7:
    return None
```

#### **After（config.py使用後）:**
```python
from config import APIConfig, BusinessLogic

# Line 83: 設定可能なタイムアウト
response = requests.get(url, timeout=APIConfig.TIMEOUT_SECONDS)

# Line 334: 設定可能な再試行待機時間
time.sleep(APIConfig.RETRY_DELAY_SECONDS)

# Line 538: 設定可能な株式処理待機時間
time.sleep(APIConfig.STOCK_DELAY_SECONDS)

# Line 275: 名前付き定数
net_cash += investment_value * BusinessLogic.INVESTMENT_VALUATION_RATIO

# Line 77: 名前付きバリデーション
if len(postal_code) < APIConfig.POSTAL_CODE_MIN_LENGTH:
    return None
```

---

### **例2: get_jp_stocklist.py のリファクタリング**

#### **Before（現在のコード）:**
```python
# Line 55: URLのハードコード
url = "https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls"

# Line 61: ファイル名のハードコード
response_content = requests.get(url).content
with open("tickers.xls", "wb") as f:
    f.write(response_content)

# Line 100: 出力ファイル名のハードコード
with open("stocks_all.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
```

#### **After（config.py使用後）:**
```python
from config import DataSources, FileSystem

# Line 55: 設定可能なURL
url = DataSources.JPX_URL

# Line 61: 設定可能なファイル名
response_content = requests.get(url).content
with open(FileSystem.TEMP_XLS_FILE, "wb") as f:
    f.write(response_content)

# Line 100: 設定可能な出力ファイル名
with open(FileSystem.MASTER_JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
```

---

### **例3: combine_latest_csv.py のリファクタリング**

#### **Before（現在のコード）:**
```python
# Line 25, 243, 267, 273: 区切り文字の重複
print("=" * 60)
print("=" * 60)
print("=" * 60)
print("=" * 60)

# Line 58: ディレクトリとパターンのハードコード
export_dir = "./Export"
pattern = "japanese_stocks_data_*.csv"

# Line 77: バリデーションの重複
if len(postal_code) < 7:
    return None

# Line 185: ファイルサイズ計算
size_mb = total_size / (1024 * 1024)
```

#### **After（config.py使用後）:**
```python
from config import Formatting, FileSystem, APIConfig

# Lines 25, 243, 267, 273: 統一された区切り文字
print(Formatting.SEPARATOR_EQUALS_SHORT)
print(Formatting.SEPARATOR_EQUALS_SHORT)
print(Formatting.SEPARATOR_EQUALS_SHORT)
print(Formatting.SEPARATOR_EQUALS_SHORT)

# Line 58: 設定可能なディレクトリとパターン
export_dir = FileSystem.EXPORT_DIR
pattern = FileSystem.CSV_SEARCH_PATTERN

# Line 77: 統一されたバリデーション
if len(postal_code) < APIConfig.POSTAL_CODE_MIN_LENGTH:
    return None

# Line 185: 名前付き定数でファイルサイズ計算
size_mb = total_size / Formatting.BYTES_PER_MB
```

---

### **例4: split_stocks.py のリファクタリング**

#### **Before（現在のコード）:**
```python
# Line 20: デフォルトチャンクサイズのハードコード
default_chunk_size = 1000

# Line 39, 56, 112, 114, 119: 区切り文字の重複
print("-" * 50)
print("-" * 50)
print("-" * 50)
print("-" * 50)
print("-" * 50)

# Line 48: ファイル名パターンのハードコード
output_file = f"stocks_{i + 1}.json"

# Line 92: 入力ファイル名のハードコード
default_input = "stocks_all.json"
```

#### **After（config.py使用後）:**
```python
from config import BusinessLogic, Formatting, FileSystem

# Line 20: 設定可能なデフォルトチャンクサイズ
default_chunk_size = BusinessLogic.DEFAULT_CHUNK_SIZE

# Lines 39, 56, 112, 114, 119: 統一された区切り文字
print(Formatting.SEPARATOR_DASHES)
print(Formatting.SEPARATOR_DASHES)
print(Formatting.SEPARATOR_DASHES)
print(Formatting.SEPARATOR_DASHES)
print(Formatting.SEPARATOR_DASHES)

# Line 48: パターンベースのファイル名
output_file = FileSystem.SPLIT_JSON_PATTERN.format(i + 1)

# Line 92: 設定可能な入力ファイル名
default_input = FileSystem.MASTER_JSON_FILE
```

---

## 🎯 推奨アクション

### **即座に実施すべき作業（優先度: 高）:**

1. **`stock_list/config.py` を作成**
   - 上記の提案構造を実装
   - 全クラスにdocstringを追加
   - 各定数に説明コメントを追加

2. **重複定数を優先的にリファクタリング:**
   - ✅ 郵便番号バリデーション（2ファイル影響）
   - ✅ 区切り文字列（14箇所、3ファイル影響）
   - ✅ 投資有価証券評価係数（2箇所、sumalize.py）

3. **全4スクリプトのインポート更新:**
   - `sumalize.py`
   - `get_jp_stocklist.py`
   - `combine_latest_csv.py`
   - `split_stocks.py`

---

## ✨ 期待される効果

### **保守性向上:**
✅ **単一責任の原則** - 設定値の変更が1箇所で完結
✅ **変更の容易性** - JPXのURL変更やファイル命名規則の変更に即座に対応
✅ **可読性向上** - マジックナンバーが名前付き定数に置き換わり、コードの意図が明確化

### **開発効率向上:**
✅ **IDE補完サポート** - `config.APIConfig.` で候補が表示される
✅ **型安全性** - Python型ヒントによる静的解析サポート
✅ **ドキュメント化** - 設定ファイル自体が生きたドキュメントとして機能

### **テスト容易性向上:**
✅ **モック可能** - ユニットテスト時に設定値を簡単にモック化
✅ **環境切り替え** - 開発/本番環境で異なる設定を容易に適用可能

### **リスク削減:**
✅ **整合性保証** - 重複定数が一元化され、変更時の整合性リスクが消滅
✅ **変更影響の明確化** - どの設定がどのスクリプトに影響するか追跡可能

---

## 📊 統計サマリー

| カテゴリ | 検出箇所数 | 影響ファイル数 | 優先度 |
|---------|-----------|--------------|--------|
| API/ネットワーク設定 | 9 | 1 | 🔴 高 |
| ファイルシステム定数 | 11 | 4 | 🔴 高 |
| フォーマット・表示定数 | 18 | 3 | 🟡 中 |
| ビジネスロジック定数 | 8 | 2 | 🟡 中 |
| フォーマット文字列 | 6+ | 2 | 🟢 低 |
| **合計** | **52+** | **4** | - |

### **重複パターン分析:**
- 区切り文字列: **14箇所** の重複（最多）
- 郵便番号バリデーション: **2ファイル** で同一ロジック
- 投資評価係数: **2箇所** で同一値
- ファイル名 `stocks_all.json`: **2ファイル** で使用

---

## 🚀 次のステップ

1. **config.py作成** - 提案された構造をベースに実装
2. **段階的リファクタリング** - 1ファイルずつ順次対応
3. **テスト実行** - リファクタリング後の動作確認
4. **ドキュメント更新** - README.mdに設定ファイルの説明を追加

---

**作成日:** 2025-10-20
**分析対象:** stock_list/ ディレクトリ全4ファイル
**検出総数:** 52+ 箇所の改善候補
