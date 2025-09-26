#!/usr/bin/env python3
"""
stocks_all.jsonを1000社ずつのファイルに分割するスクリプト
"""

import json
import math
import argparse
import sys


def split_stocks_json(input_file="stocks_all.json", chunk_size=1000):
    """
    stocks_all.jsonを指定されたサイズのチャンクに分割

    Args:
        input_file (str): 入力JSONファイル名
        chunk_size (int): 1ファイルあたりの企業数
    """
    try:
        # 元のJSONファイルを読み込み
        with open(input_file, "r", encoding="utf-8") as f:
            stock_data = json.load(f)

        total_companies = len(stock_data)
        total_files = math.ceil(total_companies / chunk_size)

        print(f"総企業数: {total_companies}社")
        print(f"分割ファイル数: {total_files}ファイル")
        print(f"1ファイルあたり: 最大{chunk_size}社")
        print("-" * 50)

        # チャンクに分割して保存
        for i in range(total_files):
            start_idx = i * chunk_size
            end_idx = min((i + 1) * chunk_size, total_companies)
            chunk_data = stock_data[start_idx:end_idx]

            # ファイル名を生成（stocks_1.json, stocks_2.json, ...）
            output_filename = f"stocks_{i + 1}.json"

            # JSON形式で保存
            with open(output_filename, "w", encoding="utf-8") as f:
                json.dump(chunk_data, f, ensure_ascii=False, indent=2)

            print(f"✅ {output_filename}: {len(chunk_data)}社 (#{start_idx + 1}-#{end_idx})")

        print("-" * 50)
        print(f"分割完了: {total_files}個のファイルを作成しました")

        # 各ファイルの情報を表示
        print("\n作成されたファイル:")
        for i in range(total_files):
            filename = f"stocks_{i + 1}.json"
            with open(filename, "r", encoding="utf-8") as f:
                data = json.load(f)
            print(f"  {filename}: {len(data)}社")

    except FileNotFoundError:
        print(f"❌ エラー: {input_file}が見つかりません")
    except json.JSONDecodeError:
        print(f"❌ エラー: {input_file}の形式が正しくありません")
    except Exception as e:
        print(f"❌ エラー: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="日本株リストJSONファイルを指定されたサイズのチャンクに分割します",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python split_stocks.py                           # stocks_all.jsonを1000社ずつに分割
  python split_stocks.py -i stocks_all.json       # stocks_all.jsonを1000社ずつに分割
  python split_stocks.py -i data.json -s 500      # data.jsonを500社ずつに分割
  python split_stocks.py --input stocks_all.json --size 2000  # 2000社ずつに分割
        """,
    )

    parser.add_argument(
        "-i", "--input", default="stocks_all.json", help="入力JSONファイル名 (デフォルト: stocks_all.json)"
    )

    parser.add_argument("-s", "--size", type=int, default=1000, help="1ファイルあたりの企業数 (デフォルト: 1000)")

    parser.add_argument("-v", "--verbose", action="store_true", help="詳細な出力を表示")

    args = parser.parse_args()

    # バリデーション
    if args.size <= 0:
        print("❌ エラー: チャンクサイズは正の整数である必要があります")
        sys.exit(1)

    print("=" * 60)
    print("📊 stocks_all.json分割ツール")
    print("=" * 60)
    print(f"入力ファイル: {args.input}")
    print(f"チャンクサイズ: {args.size}社")
    if args.verbose:
        print("詳細モード: ON")
    print("=" * 60)

    split_stocks_json(input_file=args.input, chunk_size=args.size)
