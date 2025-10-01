# 📊 YhooFinance x 日本株式スクリーニング ( with わが投資術)

## 🌟 概要

[わが投資術](https://amzn.to/3IEVRkq)を実践してみようと思い、yahoo fincnace を使用して取得したデータを可視化する web アプリケーションです。

## なぜ作成したか

-   シンプルに可視化したかったという思い
-   日本をよくしている企業を見つけて、より良い好循環が生まれれば幸い

## ✨ 主な機能

-   **GitHub Actions による自動データパイプライン**: 株式データの収集と更新を完全自動化
-   **リアルタイム検索・フィルタリング**: 静的ウェブアプリを使用して簡易複数条件による企業スクリーニング
-   **柔軟なデータ分割**: 改善された `split_stocks.py` による カスタマイズ可能なファイル分割
-   **株式リスト更新**: JPX 公式データからの最新株式リスト取得を githubaction 上で行える

## 🏗️ システム構成

-   データ収集パイプライン (`stock_list/`)
-   Web アプリケーション (`stock_search/`)

### GitHub Actions 自動化

1. **📊 Stock Data Fetch**: 特定株式チャンクの詳細データ収集（手動実行）
    - シンプルな入力パラメータ（株式ファイル選択のみ）
    - `stock_list/Export/` への直接保存
2. **📋 Stock List Update**: マスター株式リストの更新と分割（手動実行）
3. **🌐 Deploy to GitHub Pages**: Web アプリケーションの自動デプロイ

## 🚀 利用開始

### ローカル開発環境

#### データ処理

```bash
cd stock_list
uv venv -p 3.11
uv pip install -r requirements.txt

# 株式リスト更新
uv run get_jp_stocklist.py

# データ分割 (改良版 - 引数対応)
uv run split_stocks.py --input stocks_all.json --size 1000

# カスタム分割設定
uv run split_stocks.py -i custom_data.json -s 500

# 特定チャンクの処理（Export/フォルダに直接保存）
uv run sumalize.py stocks_1.json
```

#### Web アプリケーション

```bash
cd stock_search
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build
```

### GitHub Actions 自動化

#### 株式データ収集ワークフロー

1. GitHub リポジトリの **Actions** タブに移動
2. **"📊 Stock Data Fetch"** ワークフローを選択
3. **"Run workflow"** をクリック
4. 処理対象の株式ファイルを選択（stocks_1.json ～ stocks_4.json）
5. 実行してデータを `stock_list/Export/` に保存

#### 株式リスト更新ワークフロー

1. GitHub リポジトリの **Actions** タブに移動
2. **"📋 Stock List Update"** ワークフローを選択
3. **"Run workflow"** をクリック
4. 更新理由を入力（オプション）
5. 実行して `stocks_all.json` と分割ファイルを自動更新

#### Web アプリケーション デプロイ

-   `stock_search/` ディレクトリのファイルを変更
-   メインブランチにプッシュ
-   自動的にビルド・デプロイが実行される
-   ライブサイト: `https://{username}.github.io/waga-toushijutsu/`

### 株式データ管理

```
stock_list/ ディレクトリ構造:
├── stocks_all.json      # マスターリスト（全企業）
├── stocks_1.json        # 企業 1-1000
├── stocks_2.json        # 企業 1001-2000
├── stocks_3.json        # 企業 2001-3000
├── stocks_4.json        # 企業 3001+
└── Export/              # 生成されたデータファイル
    ├── japanese_stocks_data_*.csv
    └── stock_data_log.txt
```

## 🔧 技術仕様

### プログラミング言語・フレームワーク

-   **バックエンド**: Python 3.11+, pandas, yfinance
-   **フロントエンド**: React 19, TypeScript, Vite
-   **スタイリング**: Tailwind CSS, DaisyUI
-   **自動化**: GitHub Actions, GitHub Pages
-   **データ処理**: CSV, JSON, Papa Parse

### コントリビューション

このプロジェクトは個人開発による実験的な取り組みです。
機能要求や改善提案は Issue を通じてお気軽にご連絡ください。

## 🔗 関連リンク

-   [**ウェブアプリケーション**](testkun.net/waga-toushijutsu/)
-   **データソース**: 日本取引所グループ（JPX）公式データ

```html
https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls
```

## 📕 参考本

-   [わが投資術](https://amzn.to/3IEVRkq)
