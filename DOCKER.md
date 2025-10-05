# Docker利用ガイド

このドキュメントでは、Dockerを使用した株式分析プラットフォームのセットアップと運用方法を説明します。

## 🎯 概要

Dockerを使用することで、以下が一つのコマンドで実行可能になります：

1. ✅ **株式データ収集** - yfinance APIを使用した財務データ取得
2. ✅ **データ処理** - 株式リストの更新と分割処理
3. ✅ **フロントエンドビルド** - React + TypeScript + Viteのビルド
4. ✅ **プレビューサーバー起動** - Webアプリケーションのローカル実行

## 📋 前提条件

### 必須ソフトウェア

- **Docker Desktop** (20.10.0以降)
  - [macOS](https://docs.docker.com/desktop/install/mac-install/)
  - [Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Linux](https://docs.docker.com/desktop/install/linux-install/)

- **Docker Compose** (2.0.0以降)
  - Docker Desktopに含まれています

### システム要件

- **メモリ**: 最低4GB、推奨8GB以上
- **ディスク容量**: 最低5GB以上の空き容量
- **CPU**: マルチコア推奨

## 🚀 クイックスタート

### 基本的な使用方法

```bash
# 1. 初回起動（ビルドを含む）
./scripts/start.sh --build

# 2. 通常起動
./scripts/start.sh

# 3. バックグラウンド起動
./scripts/start.sh --detach

# 4. カスタム株式ファイル指定
./scripts/start.sh --stock-file stocks_2.json
```

### ブラウザでアクセス

起動完了後、以下のURLにアクセス：

```
http://localhost:4173
```

## 📦 Dockerアーキテクチャ

### サービス構成

```
┌─────────────────────────────────────────┐
│  Docker Compose Orchestration           │
│                                         │
│  ┌────────────────┐  ┌───────────────┐ │
│  │ Python Service │  │ Frontend      │ │
│  │ (Data Collect) │→ │ Service       │ │
│  │                │  │ (React+Vite)  │ │
│  └────────────────┘  └───────────────┘ │
│         │                    │          │
│         └─── stock-data ─────┘          │
│              (Volume)                   │
└─────────────────────────────────────────┘
```

### コンテナ詳細

#### 1. Python Data Collection Service (`python-service`)

**イメージ**: `python:3.11-slim`

**役割**:
- JPXから株式リストを取得 (`get_jp_stocklist.py`)
- JSON形式の株式データを分割 (`split_stocks.py`)
- yfinance APIで財務データを収集 (`sumalize.py`)

**ボリューム**:
- `./stock_list:/app` - 株式データディレクトリ
- `stock-data:/app/Export` - 生成データ共有

**環境変数**:
- `STOCK_FILE` - 処理対象の株式ファイル（デフォルト: `stocks_1.json`）
- `CHUNK_SIZE` - データ分割サイズ（デフォルト: `1000`）

#### 2. React Frontend Service (`frontend-service`)

**イメージ**: `node:20-alpine` (マルチステージビルド)

**役割**:
- TypeScriptコンパイル
- Viteビルド最適化
- プレビューサーバー起動

**ポート**:
- `4173:4173` - Viteプレビューサーバー

**ボリューム**:
- `stock-data:/app/public/data:ro` - データディレクトリ（読み取り専用）
- `./stock_search/src:/app/src:ro` - ソースコード（ホットリロード用）

**ヘルスチェック**:
- 10秒間隔でサーバーの稼働確認
- 30秒間の起動猶予時間

## 🔧 詳細コマンド

### Docker Composeコマンド

```bash
# ビルドして起動
docker-compose up --build

# フォアグラウンド起動
docker-compose up

# バックグラウンド起動
docker-compose up -d

# ログ確認（リアルタイム）
docker-compose logs -f

# 特定サービスのログ
docker-compose logs -f python-service
docker-compose logs -f frontend-service

# コンテナ停止
docker-compose down

# ボリュームも削除して完全停止
docker-compose down -v

# コンテナ一覧
docker-compose ps

# コンテナに入る
docker-compose exec frontend-service sh
docker-compose exec python-service bash
```

### 個別サービス実行

```bash
# Pythonデータ収集のみ実行
docker-compose run --rm python-service python sumalize.py

# 株式リスト更新のみ
docker-compose run --rm python-service python get_jp_stocklist.py

# データ分割のみ
docker-compose run --rm python-service python split_stocks.py --input stocks_all.json --size 1000

# フロントエンドビルドのみ
docker-compose run --rm frontend-service npm run build

# 開発サーバー起動
docker-compose run --rm -p 5173:5173 frontend-service npm run dev
```

## ⚙️ 環境変数設定

プロジェクトルートに `.env` ファイルを作成して設定をカスタマイズできます：

```env
# 株式データ設定
STOCK_FILE=stocks_1.json
CHUNK_SIZE=1000

# フロントエンド設定
NODE_ENV=production
VITE_BASE_PATH=/

# その他
PYTHONUNBUFFERED=1
```

## 🐛 トラブルシューティング

### 問題1: ポートが使用中

**エラー**: `Error starting userland proxy: listen tcp4 0.0.0.0:4173: bind: address already in use`

**解決策**:
```bash
# ポートを使用しているプロセスを確認
lsof -i :4173

# プロセスを停止するか、docker-compose.ymlでポートを変更
# ports:
#   - "8080:4173"
```

### 問題2: ビルドエラー

**エラー**: `ERROR [internal] load metadata for docker.io/library/python:3.11-slim`

**解決策**:
```bash
# Dockerデーモンが起動しているか確認
docker ps

# Docker Desktopを再起動
# または、ビルドキャッシュをクリア
docker-compose build --no-cache
```

### 問題3: データが表示されない

**原因**: Pythonサービスのデータ収集が完了していない

**解決策**:
```bash
# Pythonサービスのログを確認
docker-compose logs python-service

# データディレクトリを確認
ls -la stock_list/Export/

# 手動でデータ収集を実行
docker-compose run --rm python-service python sumalize.py
```

### 問題4: ホットリロードが効かない

**原因**: ボリュームマウントの設定問題

**解決策**:
```bash
# docker-compose.ymlのvolumesセクションを確認
# 開発モードで起動
docker-compose run --rm -p 5173:5173 frontend-service npm run dev
```

## 📊 パフォーマンス最適化

### ビルドキャッシュの活用

Dockerfileはマルチステージビルドとレイヤーキャッシングを採用しています：

```dockerfile
# 依存関係のみを先にインストール（キャッシュ効率化）
COPY package*.json ./
RUN npm ci

# ソースコードは後からコピー
COPY . .
```

### ボリュームマウント戦略

- **データディレクトリ**: 読み書き可能なボリューム
- **ソースコード**: 読み取り専用マウント（安全性向上）
- **node_modules**: 匿名ボリュームでホストと分離

## 🔒 セキュリティ

### 実装済みセキュリティ対策

1. **非rootユーザー実行**
   ```dockerfile
   RUN useradd -m -u 1000 stockuser
   USER stockuser
   ```

2. **最小権限の原則**
   - データディレクトリは読み取り専用でマウント
   - 必要最小限のファイルのみコピー

3. **`.dockerignore`の活用**
   - 不要なファイルをイメージから除外
   - シークレット情報の混入防止

4. **ヘルスチェック**
   - コンテナの稼働状態を定期的に確認
   - 異常時の自動再起動

## 📝 既存環境との共存

このDocker環境は既存のセットアップと共存可能です：

### ローカル開発環境
```bash
# 従来の方法（Python + Node.js直接実行）
cd stock_list
python sumalize.py

cd ../stock_search
npm run dev
```

### Docker環境
```bash
# Docker を使用
./scripts/start.sh
```

### GitHub Actions
- 既存のGitHub Actionsワークフローは影響を受けません
- 必要に応じてDocker化されたワークフローも追加可能

## 🚀 次のステップ

### 本番環境デプロイ

1. **Docker Hub / GitHub Container Registryへのプッシュ**
   ```bash
   docker tag waga-toushijutsu-frontend:latest username/stock-frontend:latest
   docker push username/stock-frontend:latest
   ```

2. **環境変数の外部化**
   - `.env`ファイルをGit管理から除外
   - シークレット管理ツールの使用（AWS Secrets Manager, HashiCorp Vaultなど）

3. **CI/CDパイプライン統合**
   - GitHub Actionsでのイメージビルド
   - 自動テストとデプロイ

### 拡張機能

- **開発モード専用のdocker-compose.dev.yml**の作成
- **データベースサービス**の追加（PostgreSQL, Redisなど）
- **Nginxリバースプロキシ**の追加
- **モニタリング・ロギング**（Prometheus, Grafana, ELKスタック）

## 📚 参考リンク

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Compose公式ドキュメント](https://docs.docker.com/compose/)
- [Dockerfile ベストプラクティス](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Node.js Dockerイメージ](https://hub.docker.com/_/node)
- [Python Dockerイメージ](https://hub.docker.com/_/python)

## ❓ よくある質問

**Q: Dockerを使うメリットは？**

A: 環境依存の問題を解消し、誰でも同じ環境で実行可能になります。Python 3.11とNode.js 20が自動的にインストールされます。

**Q: 既存のファイルは影響を受けますか？**

A: いいえ。Dockerは既存のファイルをそのまま使用し、新しい実行環境を提供するだけです。

**Q: データ収集に時間がかかります**

A: yfinance APIの制限により、1社あたり3-5秒かかります。`STOCK_FILE`環境変数で処理するファイルを調整できます。

**Q: 開発中のホットリロードは使えますか？**

A: はい。`docker-compose.yml`でソースディレクトリをマウントしているため、ファイル変更が自動反映されます。

## 📧 サポート

問題が発生した場合は、以下の情報を含めてIssueを作成してください：

- Docker/Docker Composeのバージョン
- OS情報
- エラーメッセージ
- 実行したコマンド
- `docker-compose logs`の出力
