import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';

export const NotFound: React.FC = () => {
  const breadcrumbItems = [
    { label: 'ホーム', href: '/', icon: '🏠' },
    { label: '404 エラー', icon: '❌' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          {/* 404 アイコン */}
          <div className="text-8xl mb-6">
            🔍
          </div>

          {/* エラーメッセージ */}
          <h1 className="text-4xl font-bold text-base-content mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-base-content mb-6">
            ページが見つかりません
          </h2>

          <p className="text-base-content/70 mb-8 leading-relaxed">
            お探しのページは存在しないか、移動または削除された可能性があります。<br />
            URLをご確認いただくか、以下のリンクからホームページにお戻りください。
          </p>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary"
            >
              🏠 ホームに戻る
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              ⬅️ 前のページに戻る
            </button>
          </div>

          {/* 追加情報 */}
          <div className="mt-12 p-4 bg-info/10 border border-info/30 rounded-lg">
            <h3 className="font-semibold text-info mb-2">
              💡 よくアクセスされるページ
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/"
                className="link link-info text-sm"
              >
                📊 データビューア
              </Link>
            </div>
          </div>

          {/* サポート情報 */}
          <div className="mt-6 text-xs text-base-content/50">
            問題が解決しない場合は、ブラウザを更新するか、<br />
            しばらく時間をおいてから再度アクセスしてください。
          </div>
        </div>
      </div>
    </div>
  );
};