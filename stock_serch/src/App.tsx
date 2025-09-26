import { useState, useEffect } from 'react';
import { useCSVData } from './hooks/useCSVData';
import { useFilters } from './hooks/useFilters';
import { FileUpload } from './components/FileUpload';
import { SearchFilters } from './components/SearchFilters';
import { DataTable } from './components/DataTable';
import { Pagination } from './components/Pagination';
import type { PaginationConfig } from './types/stock';

function App() {
  const { data, loading, error, loadCSVFile } = useCSVData();
  const { filters, filteredData, sortConfig, availableIndustries, updateFilter, clearFilters, handleSort } = useFilters(data);
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    currentPage: 1,
    itemsPerPage: 50,
    totalItems: 0
  });

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

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            📊 Japanese Stock Search
          </h1>
          <p className="text-base-content/70">
            日本株式データの検索・分析アプリケーション
          </p>
        </div>

        {/* データサマリー */}
        {summary && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
          </div>
        )}

        {/* ファイルアップロード */}
        <FileUpload 
          onFileSelect={loadCSVFile}
          loading={loading}
          error={error}
        />

        {data.length > 0 && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
