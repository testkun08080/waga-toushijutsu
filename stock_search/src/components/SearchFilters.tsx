import React, { useState } from 'react';
import { MARKET_OPTIONS } from '../types/stock';
import type { SearchFilters as SearchFiltersType } from '../types/stock';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  availableIndustries: string[];
  onFilterChange: (key: keyof SearchFiltersType, value: string | number | string[] | null) => void;
  onClearFilters: () => void;
}

// 都道府県のオプション
const PREFECTURE_OPTIONS = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  availableIndustries,
  onFilterChange,
  onClearFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    valuation: false,
    performance: false,
    balance: false,
    cash: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    const currentIndustries = filters.industries || [];
    if (checked) {
      onFilterChange('industries', [...currentIndustries, industry]);
    } else {
      onFilterChange('industries', currentIndustries.filter(i => i !== industry));
    }
  };

  const NumberRangeInput = ({
    label,
    unit = '',
    minKey,
    maxKey,
    step = 1,
    isInteger = false
  }: {
    label: string;
    unit?: string;
    minKey: keyof SearchFiltersType;
    maxKey: keyof SearchFiltersType;
    step?: number;
    isInteger?: boolean;
  }) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-sm">{label} {unit && `(${unit})`}</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="input input-bordered input-sm flex-1"
          placeholder="最小"
          step={step}
          value={filters[minKey] || ''}
          onChange={(e) => onFilterChange(minKey, e.target.value ? (isInteger ? parseInt(e.target.value) : parseFloat(e.target.value)) : null)}
        />
        <span className="text-xs opacity-60">〜</span>
        <input
          type="number"
          className="input input-bordered input-sm flex-1"
          placeholder="最大"
          step={step}
          value={filters[maxKey] || ''}
          onChange={(e) => onFilterChange(maxKey, e.target.value ? (isInteger ? parseInt(e.target.value) : parseFloat(e.target.value)) : null)}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-base-content">🔍 検索フィルター</h3>
        <button
          onClick={onClearFilters}
          className="btn btn-outline btn-sm"
        >
          🗑️ すべてクリア
        </button>
      </div>

      {/* 基本フィルター */}
      <div className="collapse collapse-arrow bg-base-200 mb-4">
        <input
          type="checkbox"
          checked={expandedSections.basic}
          onChange={() => toggleSection('basic')}
        />
        <div className="collapse-title text-lg font-medium">
          📋 基本フィルター
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 会社名検索 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">会社名</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="会社名で検索"
                value={filters.companyName}
                onChange={(e) => onFilterChange('companyName', e.target.value)}
              />
            </div>

            {/* 市場選択 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">優先市場</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filters.market}
                onChange={(e) => onFilterChange('market', e.target.value)}
              >
                <option value="">すべて</option>
                {MARKET_OPTIONS.map((market) => (
                  <option key={market} value={market}>
                    {market.replace('（内国株式）', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* 都道府県選択 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">都道府県</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filters.prefecture}
                onChange={(e) => onFilterChange('prefecture', e.target.value)}
              >
                <option value="">すべて</option>
                {PREFECTURE_OPTIONS.map((prefecture) => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture}
                  </option>
                ))}
              </select>
            </div>

            {/* 時価総額 */}
            <NumberRangeInput
              label="時価総額"
              unit="億円"
              minKey="marketCapMin"
              maxKey="marketCapMax"
              isInteger={true}
            />
          </div>

          {/* 業種選択（複数選択） */}
          <div className="form-control mt-6">
            <label className="label">
              <span className="label-text">業種選択（複数選択可）</span>
              <span className="label-text-alt">{filters.industries.length > 0 ? `${filters.industries.length}件選択中` : ''}</span>
            </label>
            <div className="bg-base-100 border border-base-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableIndustries.map((industry) => (
                  <label key={industry} className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm mr-2"
                      checked={filters.industries.includes(industry)}
                      onChange={(e) => handleIndustryChange(industry, e.target.checked)}
                    />
                    <span className="label-text text-sm">{industry}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* バリュエーション指標 */}
      <div className="collapse collapse-arrow bg-base-200 mb-4">
        <input
          type="checkbox"
          checked={expandedSections.valuation}
          onChange={() => toggleSection('valuation')}
        />
        <div className="collapse-title text-lg font-medium">
          📊 バリュエーション指標
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberRangeInput label="PBR" minKey="pbrMin" maxKey="pbrMax" step={0.1} />
            <NumberRangeInput label="ROE" unit="%" minKey="roeMin" maxKey="roeMax" step={0.1} />
            <NumberRangeInput label="自己資本比率" unit="%" minKey="equityRatioMin" maxKey="equityRatioMax" step={0.1} />
            <NumberRangeInput label="PER(会予)" minKey="forwardPEMin" maxKey="forwardPEMax" step={0.1} />
          </div>
        </div>
      </div>

      {/* 業績・収益性 */}
      <div className="collapse collapse-arrow bg-base-200 mb-4">
        <input
          type="checkbox"
          checked={expandedSections.performance}
          onChange={() => toggleSection('performance')}
        />
        <div className="collapse-title text-lg font-medium">
          💹 業績・収益性指標
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberRangeInput label="売上高" unit="億円" minKey="revenueMin" maxKey="revenueMax" isInteger={true} />
            <NumberRangeInput label="営業利益" unit="億円" minKey="operatingProfitMin" maxKey="operatingProfitMax" isInteger={true} />
            <NumberRangeInput label="営業利益率" unit="%" minKey="operatingMarginMin" maxKey="operatingMarginMax" step={0.1} />
            <NumberRangeInput label="当期純利益" unit="億円" minKey="netProfitMin" maxKey="netProfitMax" isInteger={true} />
            <NumberRangeInput label="純利益率" unit="%" minKey="netMarginMin" maxKey="netMarginMax" step={0.1} />
          </div>
        </div>
      </div>

      {/* バランスシート */}
      <div className="collapse collapse-arrow bg-base-200 mb-4">
        <input
          type="checkbox"
          checked={expandedSections.balance}
          onChange={() => toggleSection('balance')}
        />
        <div className="collapse-title text-lg font-medium">
          🏛️ バランスシート指標
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberRangeInput label="負債" unit="億円" minKey="totalLiabilitiesMin" maxKey="totalLiabilitiesMax" isInteger={true} />
            <NumberRangeInput label="流動負債" unit="億円" minKey="currentLiabilitiesMin" maxKey="currentLiabilitiesMax" isInteger={true} />
            <NumberRangeInput label="流動資産" unit="億円" minKey="currentAssetsMin" maxKey="currentAssetsMax" isInteger={true} />
            <NumberRangeInput label="総負債" unit="億円" minKey="totalDebtMin" maxKey="totalDebtMax" isInteger={true} />
            <NumberRangeInput label="投資有価証券" unit="億円" minKey="investmentsMin" maxKey="investmentsMax" isInteger={true} />
          </div>
        </div>
      </div>

      {/* キャッシュ関連 */}
      <div className="collapse collapse-arrow bg-base-200 mb-4">
        <input
          type="checkbox"
          checked={expandedSections.cash}
          onChange={() => toggleSection('cash')}
        />
        <div className="collapse-title text-lg font-medium">
          💰 キャッシュ関連指標
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumberRangeInput label="現金及び現金同等物" unit="億円" minKey="cashMin" maxKey="cashMax" isInteger={true} />
            <NumberRangeInput label="ネットキャッシュ" unit="億円" minKey="netCashMin" maxKey="netCashMax" isInteger={true} />
            <NumberRangeInput label="ネットキャッシュ比率" unit="%" minKey="netCashRatioMin" maxKey="netCashRatioMax" step={0.1} />
          </div>
        </div>
      </div>
    </div>
  );
};