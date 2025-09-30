import { Breadcrumb } from '../components/Breadcrumb';
import {
  FaGithub,
  FaEnvelope
} from 'react-icons/fa';
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon
} from 'react-share';

export const AboutPage = () => {
  const breadcrumbItems = [
    { label: 'ホーム', href: '/', icon: '🏠' },
    { label: 'このサイトについて', icon: 'ℹ️' }
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "日本株式のスクリーニングサービス";

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            ℹ️ このサイトについて
          </h1>
          <p className="text-base-content/70">
            yf x 日本株スクリーニングサービス
          </p>
        </div>

        {/* 概要 */}
        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">🎯 概要</h2>
            <p className="text-base-content/80 leading-relaxed">
              本サービスは、YahooFinanceのデータを使った日本株式のスクリーニングサービスです。
            </p>
          </div>
        </div>

        {/* なぜ作成したか */}
        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">❓ なぜ作成したか？</h2>
            <div className="space-y-4 text-base-content/80 leading-relaxed">
              <p>
                わが投資術という本を拝読して、日本株というものに興味を持ったのがきっかけです。
                日本の企業ってここまであるのかというのも全く知らないで人生を送ってきました。
              </p>
              <p>
                少しプログラムの知識がありましたので、yfinanceのデータを使用して、まずは可視化してみようと思ったのがきっかけです。
              </p>
              <p>
                日本をもっと盛り上げていく企業を探して、利益も出しつつ、というようなwin-winを目指して作成しました。
              </p>
              <p>
                また、わが投資術の著者がおっしゃっているように、
                小さな幸せは、「人は誰かの役に立っている」というエゴなのか、認識で、幸福感を感じると思っています。
              </p>
              <p>
                実際私もそうです。
              </p>
              <p className="font-semibold">
                使われる方の役に立てれば幸いです。
              </p>
            </div>
          </div>
        </div>

        {/* データソース */}
        <div className="card bg-base-100 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">📊 データソース / 🙏 お礼</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              株式のリストは以下のJPXのエクセルデータを元にしています。
            </p>
            <ul className="list-disc list-inside text-base-content/80 mb-4">
              <li>
                <a
                  href="https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  JPX (日本取引所グループ) 公式データ
                </a>
              </li>
              <li>
                <a
                  href="https://ranaroussi.github.io/yfinance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary"
                >
                  yfinance APIによるデータ
                </a>
              </li>
            </ul>
            <p className="text-base-content/80 leading-relaxed">
            ※使わせていただいているJPXのデータやyfinanceの作成者に感謝申し上げます。
            </p>
          </div>
        </div>

        {/* SNSシェア */}
        <div className="card bg-base-100 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">📢 シェアしてください</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              このサービスが役に立ったら、ぜひシェアしてください！
            </p>
            <div className="flex gap-4 justify-center items-center">
              <TwitterShareButton
                url={shareUrl}
                title={shareTitle}
                hashtags={['日本株', '投資', 'スクリーニング']}
              >
                <TwitterIcon size={48} round />
              </TwitterShareButton>

              <FacebookShareButton
                url={shareUrl}
                hashtag="#日本株"
              >
                <FacebookIcon size={48} round />
              </FacebookShareButton>

              <LineShareButton
                url={shareUrl}
                title={shareTitle}
              >
                <LineIcon size={48} round />
              </LineShareButton>
            </div>
          </div>
        </div>

        {/* 寄付 */}
        <div className="card bg-primary/10 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">❤️ 寄付</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              役に立ったりしたらシェアもしくは、既存のyfinanceへの寄付や、私宛へ寄付していただけると長くサービスを継続できます。
            </p>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <a
                href="https://github.com/sponsors/testkun08080"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline gap-2 hover:bg-gray-800 hover:text-white"
                title="GitHub Sponsors"
              >
                <FaGithub size={20} />
                GitHub Sponsors
              </a>
              <a
                href="https://www.buymeacoffee.com/testkun08080"
                target="_blank"
                rel="noopener noreferrer"
                title="Buy Me a Coffee"
              >
                <img
                  src="https://img.buymeacoffee.com/button-api/?text=&emoji=☕&slug=testkun08080&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
                  alt="Buy Me a Coffee"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>

        {/* コンタクト */}
        <div className="card bg-base-100 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">📧 コンタクト</h2>
            <p className="text-base-content/80 leading-relaxed mb-4">
              ご質問やご要望がございましたら、お気軽にご連絡ください。
            </p>
            <div className="flex gap-4 justify-center">
              
              <a
                href="mailto:testkun.08080@gmail.com"
                className="btn btn-outline gap-2 hover:bg-red-500 hover:text-white hover:border-red-500"
                title="メールでお問い合わせ"
              >
                <FaEnvelope size={20} />
                メール
              </a>
              <a
                href="https://github.com/testkun08080"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline gap-2 hover:bg-gray-800 hover:text-white hover:border-gray-800"
                title="GitHub プロフィール"
              >
                <FaGithub size={20} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* 免責事項 */}
        <div className="mt-8 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <p className="text-sm text-center">
            ⚠️ <strong>投資判断に関する免責事項</strong><br />
            本サービスで提供される情報は参考情報であり、投資助言ではありません。
            投資判断は自己責任で行い、損失に対する責任は負いかねます。
          </p>
        </div>
      </div>
    </div>
  );
};