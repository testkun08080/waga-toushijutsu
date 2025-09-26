import React from 'react';
import { MARKET_OPTIONS } from '../types/stock';
import type { SearchFilters as SearchFiltersType } from '../types/stock';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  availableIndustries: string[];
  onFilterChange: (key: keyof SearchFiltersType, value: any) => void;
  onClearFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  availableIndustries,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-base-content">検索フィルター</h3>
        <button
          onClick={onClearFilters}
          className="btn btn-outline btn-sm"
        >
          クリア
        </button>
      </div>

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

        {/* 業種選択 */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">業種</span>
          </label>
          <select
            className="select select-bordered select-sm"
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
          >
            <option value="">すべて</option>
            {availableIndustries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* 市場選択 */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">市場</span>
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
      </div>

      {/* 数値フィルター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* PBRレンジ */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">PBR</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="input input-bordered input-sm flex-1"
              placeholder="最小"
              step="0.1"
              value={filters.pbrMin || ''}
              onChange={(e) => onFilterChange('pbrMin', e.target.value ? parseFloat(e.target.value) : null)}
            />
            <span className="text-sm opacity-60">〜</span>
            <input
              type="number"
              className="input input-bordered input-sm flex-1"
              placeholder="最大"
              step="0.1"
              value={filters.pbrMax || ''}
              onChange={(e) => onFilterChange('pbrMax', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
        </div>

        {/* ROEレンジ */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">ROE (%)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="input input-bordered input-sm flex-1"
              placeholder="最小"
              step="0.1"
              value={filters.roeMin || ''}
              onChange={(e) => onFilterChange('roeMin', e.target.value ? parseFloat(e.target.value) : null)}
            />
            <span className="text-sm opacity-60">〜</span>
            <input
              type="number"
              className="input input-bordered input-sm flex-1"
              placeholder="最大"
              step="0.1"
              value={filters.roeMax || ''}
              onChange={(e) => onFilterChange('roeMax', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
        </div>

        {/* 時価総額レンジ */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">時価総額 (億円)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="input input-bordered input-sm flex-1"
              placeholder="最小"
              value={filters.marketCapMin || ''}
              onChange={(e) => onFilterChange('marketCapMin', e.target.value ? parseInt(e.target.value) : null)}
            />
            <span className="text-sm opacity-60">〜</span>
            <input
              type="number"
              className="input input-bordered input-sm flex-1"
              placeholder="最大"
              value={filters.marketCapMax || ''}
              onChange={(e) => onFilterChange('marketCapMax', e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};