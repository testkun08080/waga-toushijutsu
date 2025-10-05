import { useState, useEffect } from "react";
import { CSVViewer } from "../components/CSVViewer";
import { Breadcrumb } from "../components/Breadcrumb";
import { FileUpload } from "../components/FileUpload";

interface CSVFile {
    name: string;
    displayName: string;
    size: number;
    lastModified: string;
    url: string;
}

interface CSVManifest {
    files: CSVFile[];
    lastUpdated: string;
    totalFiles: number;
}

export const DataPage = () => {
    const [csvFiles, setCsvFiles] = useState<CSVFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<CSVFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        loadCSVManifest();
    }, []);

    const loadCSVManifest = async () => {
        try {
            setLoading(true);
            setError(null);

            // base path for GitHub Pages
            const basePath =
                import.meta.env.VITE_GITHUB_PAGES === "true"
                    ? "/waga-toushijutsu"
                    : "";
            const response = await fetch(`${basePath}/csv/files.json`);

            if (!response.ok) {
                // 404エラーの場合は、csvフォルダが存在しないと判断
                if (response.status === 404) {
                    console.info("CSV directory or files.json not found - showing upload interface");
                    setCsvFiles([]);
                    setError(null); // エラーではなく正常な状態として扱う
                    return;
                }
                throw new Error(
                    `CSVファイル一覧の読み込みに失敗しました (${response.status})`
                );
            }

            // レスポンスのContent-Typeをチェック
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.info("files.json not found (got HTML instead) - showing upload interface");
                setCsvFiles([]);
                setError(null);
                return;
            }

            const manifest: CSVManifest = await response.json();
            setCsvFiles(manifest.files || []);

            // 最新のファイルを自動選択
            if (manifest.files && manifest.files.length > 0) {
                // 最新のファイル（最初のアイテム）を選択
                setSelectedFile(manifest.files[0]);
            }
        } catch (err) {
            console.error("CSV manifest loading error:", err);

            // JSONパースエラーの場合（HTMLページが返ってきた場合など）
            if (err instanceof SyntaxError && err.message.includes('JSON')) {
                console.info("Invalid JSON response - showing upload interface");
                setCsvFiles([]);
                setError(null);
            } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
                console.info("Network error - CSV directory may not exist");
                setCsvFiles([]);
                setError(null);
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "データの読み込みに失敗しました"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleFileUpload = (file: File) => {
        setUploadError(null);
        setUploadedFile(file);

        // アップロードされたファイルをCSVFile形式に変換
        const uploadedCSVFile: CSVFile = {
            name: file.name,
            displayName: file.name,
            size: file.size,
            lastModified: new Date(file.lastModified).toISOString(),
            url: URL.createObjectURL(file)
        };

        setSelectedFile(uploadedCSVFile);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">CSVファイル一覧を読み込み中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="alert alert-error">
                    <svg
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{error}</span>
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={loadCSVManifest}
                    >
                        再試行
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Breadcrumb />
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-base-content mb-2">
                    📊 データビューア
                </h1>
                <p className="text-base-content/70">
                    データをフィルタリングしてCSV形式でダウンロード可能
                </p>
            </div>

            {/* 法的注意事項バナー */}
            <div className="alert alert-warning mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <div>
                    <div className="font-bold">個人利用目的のみでご利用ください</div>
                    <div className="text-sm">
                        Yahoo Financeデータの二次配布は禁止されています。
                        <a href="/about" className="link link-primary ml-2">
                            詳細はこちら
                        </a>
                    </div>
                </div>
            </div>

            {csvFiles.length === 0 ? (
                <div className="space-y-6">
                    <FileUpload
                        onFileSelect={handleFileUpload}
                        loading={false}
                        error={uploadError}
                    />

                    {!uploadedFile && (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold mb-2">
                                CSVファイルを読み込んでください
                            </h3>
                            <p className="text-base-content/70 mb-4">
                                上のエリアにCSVファイルをドラッグ&ドロップ
                            </p>

                            <div className="divider">または</div>

                            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
                                {/* ローカル環境での実行 */}
                                <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                                        💻 ローカル環境で実行（推奨）
                                    </h4>
                                    <ol className="list-decimal list-inside text-left text-sm space-y-2">
                                        <li>
                                            リポジトリをクローン
                                            <pre className="bg-base-200 p-2 rounded mt-1 text-xs overflow-x-auto">
                                                git clone [repository-url]
                                            </pre>
                                        </li>
                                        <li>
                                            Python環境をセットアップ
                                            <pre className="bg-base-200 p-2 rounded mt-1 text-xs overflow-x-auto">
                                                cd stock_list{"\n"}
                                                pip install -r requirements.txt
                                            </pre>
                                        </li>
                                        <li>
                                            データ取得スクリプトを実行
                                            <pre className="bg-base-200 p-2 rounded mt-1 text-xs overflow-x-auto">
                                                python sumalize.py
                                            </pre>
                                        </li>
                                        <li className="text-success font-medium">
                                            生成されたCSVファイルを上記エリアにアップロード
                                        </li>
                                    </ol>
                                </div>

                                {/* GitHub Actions */}
                                <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                                    <h4 className="font-semibold text-info mb-3 flex items-center gap-2">
                                        ⚙️ GitHub Actionsで生成
                                    </h4>
                                    <ol className="list-decimal list-inside text-left text-sm space-y-2">
                                        <li>
                                            リポジトリをフォーク
                                            <span className="block text-error text-xs mt-1">
                                                ⚠️ 必ずプライベートリポジトリに設定
                                            </span>
                                        </li>
                                        <li>GitHubリポジトリのActionsタブにアクセス</li>
                                        <li>「📊 Stock Data Fetch」ワークフローを実行</li>
                                        <li>
                                            生成されたCSVファイルを
                                            <code className="bg-base-200 px-1 rounded text-xs">
                                                stock_list/Export/
                                            </code>
                                            からダウンロード
                                        </li>
                                        <li className="text-info font-medium">
                                            ダウンロードしたファイルを上記エリアにアップロード
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div className="alert alert-warning max-w-2xl mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current shrink-0 h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <div className="text-sm">
                                    <div className="font-semibold">
                                        詳細は
                                        <a
                                            href="https://github.com/testkun08080/waga-toushijutsu#readme"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link link-primary mx-1"
                                        >
                                            README
                                        </a>
                                        をご確認ください
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn btn-outline btn-sm"
                                onClick={loadCSVManifest}
                            >
                                🔄 サーバーデータを再確認
                            </button>
                        </div>
                    )}

                    {uploadedFile && selectedFile && (
                        <CSVViewer file={selectedFile} />
                    )}
                </div>
            ) : (
                /* 自動ファイル情報とCSVビューア */
                <div className="space-y-6">
                    {/* 現在のファイル情報 */}
                    {selectedFile && (
                        <div className="card bg-base-100 shadow-sm">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="card-title">
                                            📊 現在のデータファイル更新日
                                        </h2>
                                        <div className="text-sm text-base-content/70 mt-1">
                                            更新日:{" "}
                                            {formatDate(
                                                selectedFile.lastModified
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={loadCSVManifest}
                                    >
                                        🔄 更新確認
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CSVビューア */}
                    {selectedFile ? (
                        <CSVViewer file={selectedFile} />
                    ) : (
                        <div className="card bg-base-100 shadow-sm">
                            <div className="card-body text-center">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-bold mb-2">
                                    ファイルを準備中
                                </h3>
                                <p className="text-base-content/70">
                                    CSVファイルを読み込んでいます。しばらくお待ちください...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
