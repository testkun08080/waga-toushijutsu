# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a comprehensive Japanese stock analysis platform designed for individual development with AI assistance. The repository provides automated data collection, web-based analysis, and continuous deployment capabilities for analyzing 3795+ Japanese small-cap companies.

### Core System Capabilities
- **Automated Data Pipeline**: GitHub Actions-powered stock data collection and updates
- **Web Application**: React-based interface deployed on GitHub Pages for real-time analysis
- **Research Repository**: Historical financial data across 23+ Japanese industry sectors
- **Export Management**: Structured data versioning and automated reporting
- **Continuous Deployment**: Automated web application deployment and data updates

### Key Features
- Store personal portfolio data in the `current/` directory
- Maintain comprehensive research data and industry analysis in the `serch/` directory
- Process and analyze 3795+ Japanese small-cap companies with automated updates
- Real-time data fetching with yfinance API integration
- Interactive web-based data exploration and filtering via GitHub Pages
- Automated stock list updates and data splitting workflows

## Repository Structure

```
portfolio/
├── .github/workflows/          # GitHub Actions automation
│   ├── stock-data-fetch.yml   # Manual data collection from specific stock chunks
│   ├── stock-list-update.yml  # Automated stock list updates and splitting (NEW)
│   └── deploy-github-pages.yml # Automated web application deployment (NEW)
├── current/                    # Personal portfolio data
│   └── tes.md                 # Portfolio tracking file
├── stock_list/                 # Data collection and processing
│   ├── Export/                # Generated data exports
│   │   └── README.md          # Export documentation
├── serch/                      # Research and analysis data
│   ├── kogata/                # Small-cap company data by industry
│   │   ├── *.csv             # Industry-specific financial data (23 sectors)
│   ├── high_netcash/         # High net cash companies analysis
│   │   ├── *.csv             # Sector-specific high net cash data
│   │   ├── summary_data.json # Analysis summary
│   │   └── 高ネットキャッシュ比率企業分析.md
│   ├── 統合データ*.csv        # Consolidated datasets
│   ├── sumalize.py            # Main data collection script
│   ├── split_stocks.py        # JSON file splitting utility
│   ├── get_jp_stocklist.py    # Stock list acquisition from JPX
│   ├── stocks_all.json        # Master stock list (updated by GitHub Actions)
│   ├── stocks_*.json          # Split stock data (4 files, 1000 companies each)
│   ├── requirements.txt       # Python dependencies
│   └── yfTest.ipynb          # Testing notebook
├── stock_search/               # Web application (React + TypeScript)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── DataTable.tsx # Dynamic CSV display
│   │   │   ├── FileUpload.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── Pagination.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useCSVData.ts
│   │   │   └── useFilters.ts
│   │   ├── utils/           # Utility functions
│   │   │   └── csvParser.ts # CSV parsing and formatting
│   │   ├── types/           # TypeScript definitions
│   │   │   └── stock.ts
│   │   └── App.tsx          # Main application
│   ├── dist/                # Built application (deployed to GitHub Pages)
│   ├── package.json         # Node.js dependencies
│   └── vite.config.ts       # Vite configuration with GitHub Pages support
├── CLAUDE.md                   # This file
└── README.md                   # Project documentation
```

## System Components

### 1. Data Collection Pipeline (`stock_list/`)

**Core Scripts:**
- `sumalize.py` - Main data collection script with yfinance API integration
- `split_stocks.py` - **Enhanced** utility with command-line arguments for flexible file splitting
- `get_jp_stocklist.py` - Stock list acquisition from JPX official data sources

**Data Processing Features:**
- **Enhanced CLI**: `split_stocks.py` now supports `--input`, `--size`, and `--verbose` flags
- Flexible input file specification (default: `stocks_all.json`)
- Customizable chunk sizes for different use cases
- Comprehensive logging with execution time tracking
- Error handling and retry mechanisms for API failures
- Rate limiting for API compliance and stability
- Automatic CSV generation with timestamping
- Master stock list management (`stocks_all.json`)

**Usage Examples:**
```bash
# Process default file
python sumalize.py

# Process specific chunk
python sumalize.py stocks_1.json

# Update master stock list
python get_jp_stocklist.py

# Enhanced split functionality with arguments
python split_stocks.py --input stocks_all.json --size 1000
python split_stocks.py -i custom_data.json -s 500 --verbose

# Legacy split (still supported)
python split_stocks.py
```

### 2. Web Application (`stock_search/`)

**Technology Stack:**
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: Custom hooks with local state
- **CSV Processing**: Papa Parse with Japanese character support
- **Deployment**: GitHub Pages with automated CI/CD

**Key Features:**
- Dynamic column detection and display for any CSV structure
- Japanese financial data formatting (円, %, 倍)
- Real-time search and filtering capabilities
- Responsive design with sticky columns for mobile compatibility
- Pagination and sorting capabilities
- File upload with drag-and-drop support
- Optimized bundle splitting for performance

**Deployment Information:**
- **URL**: `https://{username}.github.io/waga-toushijutsu/`
- **Auto-Deploy**: Triggered on changes to `stock_search/` directory
- **Build Process**: Vite production build with optimized chunks
- **Performance**: Vendor chunks separated for efficient caching

### 3. GitHub Actions Automation (`.github/workflows/`)

#### **Workflow 1: `stock-data-fetch.yml` (Manual Data Collection)**
- **Trigger**: Manual button execution (workflow_dispatch)
- **Purpose**: Process specific stock chunks for detailed financial data
- **Environment**: Ubuntu latest with Python 3.11
- **Input Parameters**: Stock file selection (stocks_1.json - stocks_4.json)
- **Process**: Data collection → Direct export to stock_list/Export/ → Automatic commit
- **Output**: Structured files in stock_list/Export/ directory with summary reports

#### **Workflow 2: `stock-list-update.yml` (Automated Stock List Management)**
- **Trigger**: Manual execution for stock list updates
- **Purpose**: Update master stock list and regenerate split files
- **Environment**: Ubuntu latest with Python 3.11
- **Enhanced Process**:
  1. Download latest stock data from JPX using `get_jp_stocklist.py`
  2. Generate `stocks_all.json` with all current Japanese stocks
  3. **NEW**: Use enhanced `split_stocks.py --input stocks_all.json --size 1000` for reliable splitting
  4. **NEW**: JSON validation for all generated split files
  5. Commit updated files with Japanese date format
- **Output**: Updated `stocks_all.json` and `stocks_*.json` files with validation
- **Commit Format**: "📋 日本株式のリストを更新(YYYY年MM月DD日)"

#### **Workflow 3: `deploy-github-pages.yml` (Web Application Deployment)**
- **Trigger**: Automatic on push to main/master branch when `stock_search/` changes
- **Purpose**: Build and deploy React application to GitHub Pages
- **Environment**: Ubuntu latest with Node.js 20
- **Process**:
  1. Install dependencies and build React application
  2. Generate optimized production bundle
  3. Deploy to GitHub Pages with proper base path configuration
- **Features**: Concurrent deployment protection, build artifact upload
- **URL**: Accessible via GitHub Pages with repository path

### 4. Export Management (`stock_list/Export/`)

**Automated File Organization:**
- Time-stamped CSV files with standardized naming
- Execution logs for debugging and monitoring
- Direct export to `stock_list/Export/` directory
- Git version control integration with descriptive commit messages

## Data Architecture

### Stock List Management

**Master Data Source**: JPX (Japan Exchange Group) official data
- **Source**: `https://www.jpx.co.jp/markets/statistics-equities/misc/tvdivq0000001vg2-att/data_j.xls`
- **Format**: Excel → JSON conversion with Japanese character support
- **Markets**: プライム (Prime), スタンダード (Standard), グロース (Growth)
- **Data Fields**: コード (Stock Code), 銘柄名 (Company Name), 市場・商品区分 (Market Classification), 33業種区分 (Industry Classification)

**File Structure:**
```
stocks_all.json      # Master list (all companies)
├── stocks_1.json    # Companies 1-1000
├── stocks_2.json    # Companies 1001-2000
├── stocks_3.json    # Companies 2001-3000
└── stocks_4.json    # Companies 3001+
```

### Industry Data Structure (serch/kogata/)

The financial data follows a comprehensive structure supporting both historical research and real-time analysis:

**Core Financial Fields:**
- **Basic Info**: 会社名 (Company Name), 銘柄コード (Stock Code), 業種 (Industry)
- **Market Data**: 優先市場 (Preferred Market), 時価総額 (Market Cap), 決算月 (Settlement Month)
- **Geographic**: 都道府県 (Prefecture), 会計基準 (Accounting Standard)
- **Valuation Ratios**: PBR, ROE, 自己資本比率 (Equity Ratio), PER(会予) (Projected PER)
- **Performance Metrics**: 売上高 (Revenue), 営業利益 (Operating Profit), 営業利益率 (Operating Margin)
- **Profitability**: 当期純利益 (Net Profit), 純利益率 (Net Margin)
- **Balance Sheet**: 負債 (Debt), 流動負債 (Current Liabilities), 流動資産 (Current Assets)
- **Cash Analysis**: ネットキャッシュ（流動資産-負債）, ネットキャッシュ比率
- **Additional Fields**: 総負債, 現金及び現金同等物, 投資有価証券

**Data Quality Features:**
- Automatic data type detection and conversion
- Japanese unit parsing (倍, %, 円) with proper formatting
- Null value handling and validation
- Unicode support for Japanese characters
- Flexible schema adaptation for varying CSV structures

**Industry Sectors Available (23 sectors):**
- **Basic Industries**: 化学, 鉄鋼, 非鉄金属, 金属製品, ゴム
- **Manufacturing**: 機械, 電気機器, 運送用, 機密製品, パルプ・紙, 繊維
- **Services**: サービス, 情報・通信業, 倉庫・運輸関連業
- **Consumer**: 小売業, 卸業者, 食料品
- **Real Estate & Finance**: 不動産業界, 証券
- **Resources**: 水産・農林業, 石油・石炭製品
- **Construction**: 建設業界
- **Other**: その他

## Development Context

This repository serves as a comprehensive Japanese stock analysis platform with:

### Japanese Business Focus
- **Language**: Primary data and interface in Japanese with Unicode support
- **Market**: Japanese stock exchanges (プライム, スタンダード, グロース)
- **Specialization**: Small-cap company (小型株) analysis and screening
- **Perspective**: Individual investor research with AI-assisted analysis
- **Cultural Context**: Japanese financial terminology and reporting standards

### Technical Environment
- **Backend**: Python 3.11+ (data processing and API integration)
- **Frontend**: React 18 + TypeScript + Vite (modern web interface)
- **Data Processing**: yfinance, pandas, Papa Parse
- **Deployment**: GitHub Actions + GitHub Pages
- **CSV Processing**: Robust handling of Japanese financial data formats
- **Version Control**: Git-based data versioning and change tracking

### Automation Strategy
- **Continuous Integration**: Multiple workflows for different aspects
- **Data Updates**: Automated stock list maintenance
- **Web Deployment**: Automatic deployment on source changes
- **Quality Assurance**: Build verification and error handling
- **Monitoring**: Comprehensive logging and artifact retention

## Common Operations

### Data Collection Operations
```bash
# Manual stock data collection (simplified workflow)
# Navigate to GitHub Actions → "📊 Stock Data Fetch"
# Select stock file (stocks_1.json - stocks_4.json)
# Execute - files saved directly to stock_list/Export/

# Update master stock list
# Navigate to GitHub Actions → "📋 Stock List Update"
# Optionally specify update reason
# Execute to refresh stocks_all.json and split files

# Check available stock files
ls stock_list/stocks_*.json

# Check generated exports
ls stock_list/Export/
```

### Web Application Development
```bash
# Start development server
cd stock_search
npm run dev

# Build for production (matches GitHub Actions)
npm run build

# Install dependencies
npm install

# Preview production build
npm run preview
```

### Deployment Operations

**Automatic Deployment:**
- Push changes to `stock_search/` directory on main/master branch
- GitHub Actions automatically builds and deploys to GitHub Pages
- Monitor deployment status in repository Actions tab

**Manual Deployment:**
- Navigate to repository's Actions tab
- Select "🌐 Deploy to GitHub Pages" workflow
- Click "Run workflow" for manual deployment

### Research Tasks
- **Portfolio Analysis**: Compare holdings (current/) with market data (serch/)
- **Sector Analysis**: Industry performance comparison using web interface
- **Stock Screening**: Multi-criteria filtering using financial metrics
- **Risk Assessment**: Balance sheet ratio analysis with automated calculations
- **Export Management**: Automated data versioning and historical tracking
- **Web-based Analysis**: Access deployed application for real-time data exploration

## GitHub Actions Workflows

### Workflow Management Strategy

**Three-Tier Automation System:**
1. **Data Collection** (`stock-data-fetch.yml`) - Manual execution for specific data processing
2. **Data Maintenance** (`stock-list-update.yml`) - Manual execution for master list updates
3. **Deployment** (`deploy-github-pages.yml`) - Automatic deployment on code changes

### Workflow Execution Guide

#### 1. Stock Data Fetch Workflow
**Purpose**: Process specific stock chunks for detailed financial data
**Execution**: Manual via GitHub Actions interface
**Parameters**:
- `stock_file`: Choose from stocks_1.json - stocks_4.json or stocks_temp.json
**Output Location**: `stock_list/Export/` directory with timestamped files

#### 2. Stock List Update Workflow
**Purpose**: Refresh master stock list and regenerate split files
**Execution**: Manual via GitHub Actions interface
**Parameters**:
- `reason`: Optional description for the update (defaults to "Manual stock list update")
**Process Flow**:
1. Download latest JPX data using `get_jp_stocklist.py`
2. Generate updated `stocks_all.json`
3. Split into chunks using improved logic
4. Commit with Japanese date format
**Output**: Updated stock list files in `stock_list/` directory

#### 3. GitHub Pages Deployment Workflow
**Purpose**: Build and deploy web application
**Execution**: Automatic on `stock_search/` changes, or manual
**Process Flow**:
1. Build React application with production configuration
2. Generate optimized bundle with vendor chunk separation
3. Deploy to GitHub Pages with proper base path
4. Update live site URL
**Live URL**: `https://{username}.github.io/waga-toushijutsu/`

### Error Handling and Monitoring

**Built-in Error Handling:**
- Timeout protection (30-60 minutes per workflow)
- Dependency validation and installation verification
- Build artifact verification before deployment
- Git commit checks to prevent empty commits
- Comprehensive logging with execution summaries

**Monitoring Features:**
- Artifact retention (30 days) for debugging
- Execution time tracking and performance metrics
- Build size reporting and optimization recommendations
- Deployment URL verification and accessibility checks

## Technical Specifications

### Japanese Language Support
- **Character Encoding**: UTF-8 throughout all components
- **Financial Terminology**: Native Japanese terms with English annotations
- **Geographic Data**: Prefecture-based analysis (都道府県)
- **Accounting Standards**: Japan GAAP compliance and tracking
- **Market Classifications**: Japanese exchange-specific categories

### Performance Considerations
- **Data Volume**: 3795+ companies across 23+ industry sectors
- **Processing Time**: ~3-5 seconds per company via yfinance API
- **Web Interface**: Optimized for large datasets with pagination and lazy loading
- **Storage**: Efficient CSV compression and Git LFS considerations
- **Caching**: Client-side data caching for improved UX
- **Bundle Optimization**: Vendor chunks separated for efficient loading

### Integration Points
- **yfinance API**: Primary data source with rate limiting and retry logic
- **GitHub Actions**: Automated workflows with comprehensive error handling
- **React Components**: Modular design for easy extension and maintenance
- **TypeScript**: Type safety for Japanese financial data structures
- **Tailwind CSS**: Responsive design system with DaisyUI components
- **GitHub Pages**: Static site hosting with custom domain support

### Security and Compliance
- **API Rate Limiting**: Respectful usage of external APIs
- **Error Handling**: Graceful failure handling without data corruption
- **Version Control**: Complete audit trail of all data changes
- **Access Control**: GitHub repository permissions and workflow security
- **Data Validation**: Input validation and sanitization throughout pipeline

## Development Workflow

### Local Development Process
1. **Environment Setup**: Python 3.11+ and Node.js 20+ required
2. **Data Development**: Work in `stock_list/` directory for data processing scripts
3. **Web Development**: Work in `stock_search/` directory for React application
4. **Testing**: Use provided test files and validation scripts
5. **Deployment**: Push to main branch triggers automatic deployment

### Production Deployment Process
1. **Code Changes**: Modify files in `stock_search/` directory
2. **Automatic Build**: GitHub Actions builds application automatically
3. **Deployment**: Application deployed to GitHub Pages with optimized configuration
4. **Verification**: Check live site and deployment logs for issues

### Data Update Process
1. **Manual Trigger**: Execute "Stock List Update" workflow via GitHub Actions
2. **Automatic Processing**: Latest data fetched and processed
3. **File Generation**: Updated stock list files committed to repository
4. **Integration**: New data available for subsequent processing workflows

This comprehensive setup supports end-to-end Japanese stock market analysis from automated data collection through web-based visualization, with full CI/CD capabilities for continuous research workflows and real-time data exploration via GitHub Pages deployment.