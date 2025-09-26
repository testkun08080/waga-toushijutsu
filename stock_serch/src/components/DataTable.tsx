import React from 'react';
import type { StockData, SortConfig } from '../types/stock';
import { formatNumber, formatCurrency, formatPercentage } from '../utils/csvParser';

interface DataTableProps {
  data: StockData[];
  sortConfig: SortConfig | null;
  onSort: (key: keyof StockData) => void;
  currentPage: number;
  itemsPerPage: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  sortConfig,
  onSort,
  currentPage,
  itemsPerPage
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const getSortIcon = (key: keyof StockData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const SortableHeader: React.FC<{ 
    label: string; 
    sortKey: keyof StockData;
    className?: string;
  }> = ({ label, sortKey, className = '' }) => (
    <th 
      className={`cursor-pointer hover:bg-base-200 transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-center gap-1">
        {label}
        <span className="text-xs opacity-60">{getSortIcon(sortKey)}</span>
      </div>
    </th>
  );

  // 動的にすべての列を取得
  const getAvailableColumns = (): Array<{key: keyof StockData, label: string, format: string}> => {
    if (currentData.length === 0) return [];
    
    const firstRow = currentData[0];
    const columns: Array<{key: keyof StockData, label: string, format: string}> = [];
    
    Object.keys(firstRow).forEach(key => {
      const typedKey = key as keyof StockData;
      const value = firstRow[typedKey];
      
      // 常に表示する基本列
      if (['会社名', '銘柄コード', '業種', '優先市場'].includes(key)) {
        columns.push({key: typedKey, label: key, format: 'string'});
      }
      // 数値列で値が存在するもの
      else if (typeof value === 'number' || (Array.isArray(currentData) && currentData.some(row => typeof row[typedKey] === 'number'))) {
        let format = 'number';
        if (key.includes('率') || key.includes('ROE')) format = 'percentage';
        else if (key.includes('総額') || key.includes('売上高') || key.includes('利益') || key.includes('負債') || key.includes('資産') || key.includes('キャッシュ')) format = 'currency';
        else if (key.includes('PBR') || key.includes('PER')) format = 'decimal';
        
        columns.push({key: typedKey, label: key, format});
      }
      // その他の文字列列
      else if (value !== null && value !== undefined) {
        columns.push({key: typedKey, label: key, format: 'string'});
      }
    });
    
    return columns;
  };

  const columns = getAvailableColumns();

  const formatValue = (value: any, format: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'decimal':
        return formatNumber(value, 2);
      case 'number':
        return formatNumber(value, 0);
      default:
        return String(value);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr className="text-center">
            {columns.map((column, index) => (
              <SortableHeader 
                key={column.key} 
                label={column.label} 
                sortKey={column.key} 
                className={`min-w-24 ${index === 0 || index === 1 ? 'sticky z-10 bg-base-200' : ''} ${index === 0 ? 'left-0' : index === 1 ? 'left-48' : ''}`}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((stock, index) => (
            <tr key={`${stock.銘柄コード}-${index}`} className="hover:bg-base-50">
              {columns.map((column, colIndex) => {
                const value = stock[column.key];
                const isNetCash = column.key === 'ネットキャッシュ（流動資産-負債）';
                const isSticky = colIndex === 0 || colIndex === 1;
                const stickyClass = isSticky ? `sticky z-10 bg-white ${colIndex === 0 ? 'left-0' : 'left-48'}` : '';
                
                return (
                  <td 
                    key={column.key} 
                    className={`text-sm ${column.format === 'string' ? 'text-left' : 'text-right'} ${stickyClass}`}
                  >
                    {column.format === 'string' && column.key === '会社名' ? (
                      <div className="max-w-48 truncate font-medium" title={String(value)}>
                        {String(value || '-')}
                      </div>
                    ) : column.format === 'string' && column.key === '銘柄コード' ? (
                      <span className="font-mono">{String(value || '-')}</span>
                    ) : column.format === 'string' && (column.key === '業種' || column.key === '優先市場') ? (
                      <div className="max-w-32 truncate" title={String(value)}>
                        {String(value || '-').replace('（内国株式）', '')}
                      </div>
                    ) : isNetCash ? (
                      <span className={value && typeof value === 'number' && value > 0 ? 'text-success' : 'text-error'}>
                        {formatValue(value, column.format)}
                      </span>
                    ) : (
                      formatValue(value, column.format)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {currentData.length === 0 && (
        <div className="text-center py-8 text-base-content/60">
          データがありません
        </div>
      )}
    </div>
  );
};