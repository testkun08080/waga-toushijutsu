import { useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  url: string;
  imageUrl: string;
  siteName: string;
  twitterSite: string;
  author: string;
}

interface SEOManagerProps {
  seoData?: Partial<SEOData>;
}

// デフォルトのSEOデータ（誤字を修正済み）
const defaultSEOData: SEOData = {
  title: 'yfわが投資術 ｜Yahoo Finance x わが投資術',
  description: 'Yahoo Financeのデータを使用して、わが投資術の基本であるネットキャッシュ比率やその他スクリーニングができるサービスです。',
  keywords: 'わが投資術,投資,Yahoo Finance,ネットキャッシュ,ネットキャッシュ比率,スクリーニング',
  url: 'https://testkun.net/waga-toushijutsu/',
  imageUrl: 'https://testkun.net/waga-toushijutsu/favicon.png',
  siteName: 'yfわが投資術',
  twitterSite: '@testkun08080',
  author: 'testkun08080'
};

export const SEOManager = ({ seoData = {} }: SEOManagerProps) => {
  const finalSEOData = { ...defaultSEOData, ...seoData };

  useEffect(() => {
    // タイトルを更新
    document.title = finalSEOData.title;

    // メタタグを更新する関数
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // 基本メタタグを更新
    updateMetaTag('description', finalSEOData.description);
    updateMetaTag('keywords', finalSEOData.keywords);

    // OGPタグを更新
    updateMetaTag('og:title', finalSEOData.title, true);
    updateMetaTag('og:description', finalSEOData.description, true);
    updateMetaTag('og:url', finalSEOData.url, true);
    updateMetaTag('og:image', finalSEOData.imageUrl, true);
    updateMetaTag('og:site_name', finalSEOData.siteName, true);

    // Twitterカードタグを更新
    updateMetaTag('twitter:title', finalSEOData.title);
    updateMetaTag('twitter:description', finalSEOData.description);
    updateMetaTag('twitter:image', finalSEOData.imageUrl);
    updateMetaTag('twitter:site', finalSEOData.twitterSite);

    // 構造化データ (JSON-LD) を更新
    const updateStructuredData = () => {
      let script = document.querySelector('script[type="application/ld+json"]');

      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: finalSEOData.title,
        description: finalSEOData.description,
        url: finalSEOData.url,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY'
        },
        author: {
          '@type': 'Organization',
          name: finalSEOData.author
        },
        publisher: {
          '@type': 'Organization',
          name: finalSEOData.author,
          logo: {
            '@type': 'ImageObject',
            url: finalSEOData.imageUrl
          }
        },
        inLanguage: 'ja-JP',
        keywords: finalSEOData.keywords
      };

      script.textContent = JSON.stringify(structuredData, null, 2);
    };

    updateStructuredData();
  }, [finalSEOData]);

  return null; // このコンポーネントは何もレンダリングしない
};

// サイト情報の定数をエクスポート（他のコンポーネントでも使用可能）
export const siteInfo = {
  name: defaultSEOData.siteName,
  fullTitle: defaultSEOData.title,
  description: defaultSEOData.description,
  url: defaultSEOData.url,
  author: defaultSEOData.author,
  twitterSite: defaultSEOData.twitterSite
};