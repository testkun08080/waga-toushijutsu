export interface StockData {
  会社名: string;
  銘柄コード: string;
  業種: string;
  優先市場: string;
  決算月: string | null;
  会計基準: string | null;
  都道府県: string | null;
  時価総額: number | null;
  PBR: number | null;
  売上高: number | null;
  営業利益: number | null;
  営業利益率: number | null;
  当期純利益: number | null;
  純利益率: number | null;
  ROE: number | null;
  自己資本比率: number | null;
  "PER(会予)": number | null;
  負債: number | null;
  流動負債: number | null;
  流動資産: number | null;
  総負債: number | null;
  "現金及び現金同等物": number | null;
  投資有価証券: number | null;
  "ネットキャッシュ（流動資産-負債）": number | null;
  ネットキャッシュ比率: number | null;
}

export interface SearchFilters {
  companyName: string;
  industry: string;
  market: string;
  pbrMin: number | null;
  pbrMax: number | null;
  roeMin: number | null;
  roeMax: number | null;
  marketCapMin: number | null;
  marketCapMax: number | null;
}

export interface SortConfig {
  key: keyof StockData;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export const MARKET_OPTIONS = [
  "プライム（内国株式）",
  "スタンダード（内国株式）",
  "グロース（内国株式）"
] as const;

export const ITEMS_PER_PAGE_OPTIONS = [50, 100, 200] as const;