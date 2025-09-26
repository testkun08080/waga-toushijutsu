# 📊 Japanese Stock Search App 開発プラン

## プロジェクト概要
CSVファイルから読み込んだ日本株データを検索・フィルタリングできるReactアプリケーション

## 🏗️ 技術スタック
- **Frontend**: Vite + React + TypeScript
- **Styling**: TailwindCSS + DaisyUI
- **Data**: CSV パース（Papa Parse）
- **State**: React hooks (useState, useEffect, useMemo)

## 📋 開発ステップ

### Phase 1: プロジェクト基盤構築
1. **Vite Reactプロジェクトセットアップ**
   - `npm create vite@latest stock_serch -- --template react-ts`
   - 基本パッケージインストール

2. **UI Framework設定**
   - TailwindCSS + DaisyUI インストール・設定
   - 基本レイアウト作成

### Phase 2: データ層実装
3. **CSV読み込み機能**
   - Papa Parse ライブラリ導入
   - CSVファイル読み込み・パース機能

4. **型定義・インターfaces**
   ```typescript
   interface StockData {
     会社名: string;
     銘柄コード: string;
     業種: string;
     時価総額: number;
     PBR: number;
     ROE: number;
     // ... その他財務指標
   }
   ```

### Phase 3: 検索・表示機能
5. **検索フィルター実装**
   - 会社名・業種での検索
   - 財務指標での範囲フィルタリング
   - 複数条件の組み合わせ

6. **データテーブル表示**
   - ページネーション
   - ソート機能
   - 列の表示/非表示切り替え

### Phase 4: UI/UX強化
7. **レスポンシブデザイン**
   - モバイル対応レイアウト
   - タブレット最適化

8. **データ分析機能**
   - 基本統計情報表示
   - 業種別集計
   - チャート表示（簡単なもの）

## 🎨 画面設計

### メイン画面構成
```
┌─────────────────────────────────────┐
│ Header (タイトル + 統計サマリー)      │
├─────────────────────────────────────┤
│ Search Filters                      │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│ │会社名│ │業種 │ │PBR  │ │ROE  │  │
│ └─────┘ └─────┘ └─────┘ └─────┘  │
├─────────────────────────────────────┤
│ Data Table                          │
│ ┌───┬─────┬────┬────┬────┬──┐  │
│ │No │会社名│業種│PBR │ROE │..│  │
│ ├───┼─────┼────┼────┼────┼──┤  │
│ │1  │XXX  │化学│1.2 │15% │..│  │
│ └───┴─────┴────┴────┴────┴──┘  │
├─────────────────────────────────────┤
│ Pagination                          │
└─────────────────────────────────────┘
```

## 🔧 主要機能

### 検索・フィルタリング
- **テキスト検索**: 会社名、業種
- **数値フィルター**: PBR, ROE, 時価総額の範囲指定
- **市場フィルター**: プライム、スタンダード、グロース
- **組み合わせ検索**: 複数条件のAND検索

### データ表示
- **ページネーション**: 50件/100件/200件表示
- **ソート**: 各列でのソート機能
- **列表示制御**: 不要な列の非表示
- **エクスポート**: フィルタ結果のCSV出力

### 分析機能
- **基本統計**: 平均PBR, ROE, 時価総額
- **業種別集計**: 業種ごとの企業数・指標平均
- **ランキング**: PBR, ROE別ランキング

## 📦 パッケージ構成
```json
{
  "dependencies": {
    "react": "^18.x",
    "papaparse": "^5.x",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "daisyui": "^4.x",
    "@types/papaparse": "^5.x"
  }
}
```

## 🎯 開発優先度
1. **高優先**: プロジェクト基盤、データ読み込み、基本検索
2. **中優先**: 高度フィルタリング、レスポンシブ対応
3. **低優先**: データ分析機能、エクスポート機能

## 📁 プロジェクト構造
```
stock_serch/
├── docs/
│   └── DEVELOPMENT_PLAN.md
├── src/
│   ├── components/
│   │   ├── SearchFilters.tsx
│   │   ├── DataTable.tsx
│   │   ├── Pagination.tsx
│   │   └── Analytics.tsx
│   ├── hooks/
│   │   ├── useCSVData.ts
│   │   └── useFilters.ts
│   ├── types/
│   │   └── stock.ts
│   ├── utils/
│   │   └── csvParser.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── data/
│       └── (CSVファイル格納)
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🚀 開発開始手順
1. Vite Reactプロジェクト作成
2. TailwindCSS + DaisyUI セットアップ
3. 基本コンポーネント構造作成
4. CSVデータ読み込み機能実装
5. 段階的機能追加

この段階的なアプローチで、まず動作する基本版を作り、その後機能を順次拡張していきます。