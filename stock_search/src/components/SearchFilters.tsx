import React, { useState } from 'react';
import type { SearchFilters as SearchFiltersType } from '../types/stock';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  availableIndustries: string[];
  availableMarkets: string[];
  availablePrefectures: string[];
  onFilterChange: (key: keyof SearchFiltersType, value: string | number | string[] | null) => void;
  onClearFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  availableIndustries,
  availableMarkets,
  availablePrefectures,
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

  const handleMarketChange = (market: string, checked: boolean) => {
    const currentMarkets = filters.market || [];
    if (checked) {
      onFilterChange('market', [...currentMarkets, market]);
    } else {
      onFilterChange('market', currentMarkets.filter(m => m !== market));
    }
  };

  const handlePrefectureChange = (prefecture: string, checked: boolean) => {
    const currentPrefectures = filters.prefecture || [];
    if (checked) {
      onFilterChange('prefecture', [...currentPrefectures, prefecture]);
    } else {
      onFilterChange('prefecture', currentPrefectures.filter(p => p !== prefecture));
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

            {/* 時価総額 */}
            <NumberRangeInput
              label="時価総額"
              unit="百万円"
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

          {/* 優先市場選択（複数選択） */}
          <div className="form-control mt-6">
            <label className="label">
              <span className="label-text">優先市場選択（複数選択可）</span>
              <span className="label-text-alt">{filters.market.length > 0 ? `${filters.market.length}件選択中` : ''}</span>
            </label>
            <div className="bg-base-100 border border-base-300 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {availableMarkets.map((market) => (
                  <label key={market} className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm mr-2"
                      checked={filters.market.includes(market)}
                      onChange={(e) => handleMarketChange(market, e.target.checked)}
                    />
                    <span className="label-text text-sm">{market.replace('（内国株式）', '')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 都道府県選択（複数選択） */}
          <div className="form-control mt-6">
            <label className="label">
              <span className="label-text">都道府県選択（複数選択可）</span>
              <span className="label-text-alt">{filters.prefecture.length > 0 ? `${filters.prefecture.length}件選択中` : ''}</span>
            </label>
            <div className="bg-base-100 border border-base-300 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availablePrefectures.map((prefecture) => (
                  <label key={prefecture} className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm mr-2"
                      checked={filters.prefecture.includes(prefecture)}
                      onChange={(e) => handlePrefectureChange(prefecture, e.target.checked)}
                    />
                    <span className="label-text text-sm">{prefecture}</span>
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
            <NumberRangeInput label="売上高" unit="百万円" minKey="revenueMin" maxKey="revenueMax" isInteger={true} />
            <NumberRangeInput label="営業利益" unit="百万円" minKey="operatingProfitMin" maxKey="operatingProfitMax" isInteger={true} />
            <NumberRangeInput label="営業利益率" unit="%" minKey="operatingMarginMin" maxKey="operatingMarginMax" step={0.1} />
            <NumberRangeInput label="当期純利益" unit="百万円" minKey="netProfitMin" maxKey="netProfitMax" isInteger={true} />
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
            <NumberRangeInput label="負債" unit="百万円" minKey="totalLiabilitiesMin" maxKey="totalLiabilitiesMax" isInteger={true} />
            <NumberRangeInput label="流動負債" unit="百万円" minKey="currentLiabilitiesMin" maxKey="currentLiabilitiesMax" isInteger={true} />
            <NumberRangeInput label="流動資産" unit="百万円" minKey="currentAssetsMin" maxKey="currentAssetsMax" isInteger={true} />
            <NumberRangeInput label="総負債" unit="百万円" minKey="totalDebtMin" maxKey="totalDebtMax" isInteger={true} />
            <NumberRangeInput label="投資有価証券" unit="百万円" minKey="investmentsMin" maxKey="investmentsMax" isInteger={true} />
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
            <NumberRangeInput label="現金及び現金同等物" unit="百万円" minKey="cashMin" maxKey="cashMax" isInteger={true} />
            <NumberRangeInput label="ネットキャッシュ" unit="百万円" minKey="netCashMin" maxKey="netCashMax" isInteger={true} />
            <NumberRangeInput label="ネットキャッシュ比率" unit="%" minKey="netCashRatioMin" maxKey="netCashRatioMax" step={0.1} />
          </div>
        </div>
      </div>
    </div>
  );
};