import { useState, useMemo } from 'react';
import type { StockData, SearchFilters, SortConfig } from '../types/stock';

const initialFilters: SearchFilters = {
  companyName: '',
  industry: '',
  market: '',
  pbrMin: null,
  pbrMax: null,
  roeMin: null,
  roeMax: null,
  marketCapMin: null,
  marketCapMax: null,
};

export const useFilters = (data: StockData[]) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const filteredData = useMemo(() => {
    let filtered = data.filter((stock) => {
      // 会社名フィルター
      if (filters.companyName && !stock.会社名.toLowerCase().includes(filters.companyName.toLowerCase())) {
        return false;
      }

      // 業種フィルター
      if (filters.industry && stock.業種 !== filters.industry) {
        return false;
      }

      // 市場フィルター
      if (filters.market && stock.優先市場 !== filters.market) {
        return false;
      }

      // PBRフィルター
      if (filters.pbrMin !== null && (stock.PBR === null || stock.PBR < filters.pbrMin)) {
        return false;
      }
      if (filters.pbrMax !== null && (stock.PBR === null || stock.PBR > filters.pbrMax)) {
        return false;
      }

      // ROEフィルター
      if (filters.roeMin !== null && (stock.ROE === null || stock.ROE < filters.roeMin / 100)) {
        return false;
      }
      if (filters.roeMax !== null && (stock.ROE === null || stock.ROE > filters.roeMax / 100)) {
        return false;
      }

      // 時価総額フィルター
      if (filters.marketCapMin !== null && (stock.時価総額 === null || stock.時価総額 < filters.marketCapMin * 100000000)) {
        return false;
      }
      if (filters.marketCapMax !== null && (stock.時価総額 === null || stock.時価総額 > filters.marketCapMax * 100000000)) {
        return false;
      }

      return true;
    });

    // ソート処理
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // null値の処理
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        let result = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          result = aValue.localeCompare(bValue, 'ja-JP');
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          result = aValue - bValue;
        }

        return sortConfig.direction === 'desc' ? -result : result;
      });
    }

    return filtered;
  }, [data, filters, sortConfig]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSort = (key: keyof StockData) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null; // ソート解除
    });
  };

  // ユニークな業種一覧を取得
  const availableIndustries = useMemo(() => {
    const industries = data
      .map(stock => stock.業種)
      .filter((industry, index, arr) => industry && arr.indexOf(industry) === index)
      .sort();
    return industries;
  }, [data]);

  return {
    filters,
    filteredData,
    sortConfig,
    availableIndustries,
    updateFilter,
    clearFilters,
    handleSort
  };
};