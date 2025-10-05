# 📊 yfinance × 日本株式スクリーニング  
**（with わが投資術）**

---

## ⚠️ 注意事項

このプロジェクトは **Yahoo Finance のデータを取得・可視化するためのツール**です。  
本ツールの利用により生じたいかなる損害についても、作者は一切の責任を負いません。

- **データの利用は Yahoo の利用規約に従ってください**  
- **本リポジトリはデータそのものを配布しません**  
- **個人利用・研究・教育目的のみ使用可**  
- **商用利用・再配布は禁止です**  
- **プライベートリポジトリでの使用を推奨します**

> 💡 取得したデータは、**あなた自身の環境でのみ利用**してください。

---

## 📘 概要

[わが投資術](https://amzn.to/3IEVRkq) の考え方をもとに、  
**日本株をシンプルに分析・可視化**するためのツールです。

- 📈 GitHub Actions による自動データ収集  
- 🔍 Web上でのスクリーニング・可視化  
- ⚙️ JPX公式データ対応・簡易データ分割機能  

---

## 💡 開発の目的

日本株に興味を持ち、
日本をよくしている企業を見つけたい、
けど、割安株を見つけてみたい。
という思いと、わが投資術を参考にして作成した、**個人開発による実験的プロジェクト**です。

---

## ⚖️ 法的情報

このツールは **yfinance** ライブラリを利用して  
**Yahoo Finance 公開データ**を取得しています。

- yfinance は **Yahoo, Inc. と提携・公認関係にありません**  
- 取得したデータの **二次配布は禁止** されています  
- すべてのデータは **ユーザーの環境で取得** してください  
- 利用時は **Yahoo の利用規約** を遵守してください  

🔗 **参考リンク**
- [Yahoo! 利用規約](https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html)  
- [Yahoo! Finance Terms](https://finance.yahoo.com/about/terms)

---

## 🧾 免責事項

本ソフトウェアは **現状のまま** 提供されます。  
動作・結果・データの正確性を保証するものではありません。  
利用はすべて **自己責任** でお願いいたします。

---

## 🛠️ 技術概要

| 項目 | 内容 |
|------|------|
| **Backend** | Python 3.11+, pandas, yfinance |
| **Frontend** | React 19 + TypeScript + Vite |
| **CI/CD** | GitHub Actions + GitHub Pages |
| **スタイル** | Tailwind CSS, DaisyUI |
| **データ形式** | CSV, JSON |

---

## 📕 データ出典

- 日本取引所グループ（JPX）公式株式データ  
  🔗 [https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls](https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls)

---

## 🧭 ライセンス

- **yfinance:** Apache License 2.0  
- **本プロジェクト:** MIT License（非商用前提）  
- **データ:** Yahoo! Japan 利用規約に従うこと  

---

## 💬 コントリビューション

このプロジェクトは個人による実験的開発です。  
提案・改善・アイデアなどがあれば、**Issue または Pull Request** からぜひご連絡ください。

---

© 2025 [Your Name or GitHub ID]  
Released under the [MIT License](./LICENSE)