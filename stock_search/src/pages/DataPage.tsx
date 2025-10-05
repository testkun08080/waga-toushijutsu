import { useState, useEffect } from "react";
import { CSVViewer } from "../components/CSVViewer";
import { Breadcrumb } from "../components/Breadcrumb";

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
                throw new Error(
                    `CSVファイル一覧の読み込みに失敗しました (${response.status})`
                );
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
            setError(
                err instanceof Error
                    ? err.message
                    : "データの読み込みに失敗しました"
            );
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
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-2xl font-bold mb-2">
                        CSVファイルがありません
                    </h3>
                    <p className="text-base-content/70 mb-4">
                        GitHub Actions
                        でデータを生成してからアクセスしてください
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={loadCSVManifest}
                    >
                        更新確認
                    </button>
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
