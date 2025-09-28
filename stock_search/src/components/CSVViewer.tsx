import { useState, useEffect } from 'react';
import { useCSVParser } from '../hooks/useCSVParser';
import { useFilters } from '../hooks/useFilters';
import { SearchFilters } from './SearchFilters';
import { DataTable } from './DataTable';
import { Pagination } from './Pagination';
import { ColumnSelector, getDefaultColumns, type ColumnConfig } from './ColumnSelector';
import type { PaginationConfig } from '../types/stock';

interface CSVFile {
  name: string;
  displayName: string;
  size: number;
  lastModified: string;
  url: string;
}

interface CSVViewerProps {
  file: CSVFile;
}

export const CSVViewer = ({ file }: CSVViewerProps) => {
  const { data, loading, error, reload } = useCSVParser(file);
  const { filters, filteredData, sortConfig, availableIndustries, updateFilter, clearFilters, handleSort, copyShareUrl } = useFilters(data);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    currentPage: 1,
    itemsPerPage: 50,
    totalItems: 0
  });
  const [columns, setColumns] = useState<ColumnConfig[]>([]);

  // データが読み込まれたときに列設定を初期化
  useEffect(() => {
    if (data.length > 0) {
      const availableColumns = Object.keys(data[0]).filter(key =>
        !key.startsWith('_') // 内部フィールドを除外
      );
      setColumns(getDefaultColumns(availableColumns));
    }
  }, [data]);

  // フィルター結果が変わったときにページをリセット
  useEffect(() => {
    setPaginationConfig(prev => ({
      ...prev,
      currentPage: 1,
      totalItems: filteredData.length
    }));
  }, [filteredData.length]);

  const handlePageChange = (page: number) => {
    setPaginationConfig(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPaginationConfig(prev => ({
      ...prev,
      currentPage: 1,
      itemsPerPage
    }));
  };

  const handleColumnChange = (key: string, visible: boolean) => {
    setColumns(prev => prev.map(col =>
      col.key === key ? { ...col, visible } : col
    ));
  };

  const handleCategoryToggle = (category: string, visible: boolean) => {
    setColumns(prev => prev.map(col =>
      col.category === category && !col.essential
        ? { ...col, visible }
        : col
    ));
  };

  const handleShareClick = async () => {
    const success = await copyShareUrl();
    if (success) {
      setShareMessage('🔗 フィルターURLをコピーしました！');
    } else {
      setShareMessage('❗ URLのコピーに失敗しました');
    }
    setTimeout(() => setShareMessage(null), 3000);
  };

  const hasActiveFilters = () => {
    return (
      filters.companyName ||
      filters.industries.length > 0 ||
      filters.market ||
      filters.prefecture ||
      Object.entries(filters).some(([key, value]) =>
        key.includes('Min') || key.includes('Max') ? value !== null : false
      )
    );
  };

  const getDataSummary = () => {
    if (data.length === 0) return null;

    const validMarketCap = data.filter(stock => stock.時価総額).map(stock => stock.時価総額!);
    const validPBR = data.filter(stock => stock.PBR).map(stock => stock.PBR!);
    const validROE = data.filter(stock => stock.ROE).map(stock => stock.ROE!);

    return {
      totalCount: data.length,
      filteredCount: filteredData.length,
      avgMarketCap: validMarketCap.length > 0 ? validMarketCap.reduce((a, b) => a + b, 0) / validMarketCap.length : 0,
      avgPBR: validPBR.length > 0 ? validPBR.reduce((a, b) => a + b, 0) / validPBR.length : 0,
      avgROE: validROE.length > 0 ? validROE.reduce((a, b) => a + b, 0) / validROE.length : 0,
    };
  };

  const summary = getDataSummary();

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">CSVデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="alert alert-error">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={reload}>
              再読み込み
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-bold mb-2">データがありません</h3>
          <p className="text-base-content/70">
            CSVファイルにデータが含まれていません
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー情報とサマリー */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="card-title text-xl">{file.displayName}</h2>
              <p className="text-base-content/70 text-sm">
                {summary ? `${summary.filteredCount.toLocaleString()} 件のデータ` : ''}
                {summary && summary.filteredCount !== summary.totalCount && ` (${summary.totalCount.toLocaleString()} 件中)`}
              </p>
            </div>

            {/* コントロールボタン */}
            <div className="flex gap-2">
              {/* シェアボタン */}
              {hasActiveFilters() && (
                <div className="relative">
                  <button
                    onClick={handleShareClick}
                    className="btn btn-outline btn-sm"
                    title="フィルター結果を共有"
                  >
                    🔗 共有
                  </button>
                  {shareMessage && (
                    <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-success text-success-content text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
                      {shareMessage}
                    </div>
                  )}
                </div>
              )}

              {/* 列選択ボタン */}
              {columns.length > 0 && (
                <ColumnSelector
                  columns={columns}
                  onColumnChange={handleColumnChange}
                  onCategoryToggle={handleCategoryToggle}
                />
              )}
            </div>
          </div>

          {/* データサマリー */}
          {summary && summary.totalCount > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{summary.totalCount}</div>
                <div className="text-sm text-base-content/70">総企業数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{summary.filteredCount}</div>
                <div className="text-sm text-base-content/70">検索結果</div>
              </div>
              <div>
                <div className="text-lg font-bold text-base-content">{(summary.avgMarketCap / 100000000).toFixed(0)}億円</div>
                <div className="text-sm text-base-content/70">平均時価総額</div>
              </div>
              <div>
                <div className="text-lg font-bold text-base-content">{summary.avgPBR.toFixed(2)}</div>
                <div className="text-sm text-base-content/70">平均PBR</div>
              </div>
              <div>
                <div className="text-lg font-bold text-base-content">{(summary.avgROE * 100).toFixed(1)}%</div>
                <div className="text-sm text-base-content/70">平均ROE</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 検索フィルター */}
      <SearchFilters
        filters={filters}
        availableIndustries={availableIndustries}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />

      {/* データテーブル */}
      <DataTable
        data={filteredData}
        sortConfig={sortConfig}
        onSort={handleSort}
        currentPage={paginationConfig.currentPage}
        itemsPerPage={paginationConfig.itemsPerPage}
        visibleColumns={columns}
      />

      {/* ページネーション */}
      <div className="mt-6">
        <Pagination
          config={{
            ...paginationConfig,
            totalItems: filteredData.length
          }}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};