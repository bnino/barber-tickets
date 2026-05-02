import { useEffect, useRef } from "react";
import { useYouTube } from "../hooks/useYouTube";

type YTPlayer = {
    destroy: () => void;
    playVideo: () => void;
};

declare global {
    interface Window {
        YT: {
            Player: new (
                elementId: string,
                options: {
                    height: string;
                    width: string;
                    videoId?: string;
                    playerVars?: Record<string, string | number | undefined>;
                    events?: {
                        onReady?: (e: { target: YTPlayer }) => void;
                    };
                }
            ) => YTPlayer;
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function MusicPlayer() {
    const {
        query,
        setQuery,
        results,
        loading,
        error,
        search,
        select,
        clear,
        selectedId,
        selectedType,
    } = useYouTube();

    const playerRef = useRef<YTPlayer | null>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const apiLoadedRef = useRef(false);

    useEffect(() => {
        if (apiLoadedRef.current) return;
        apiLoadedRef.current = true;

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }, []);

    useEffect(() => {
        if (!selectedId) return;

        const initPlayer = () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            const vars: Record<string, any> = {
                autoplay: 1,
                controls: 1,
                rel: 0,
                modestbranding: 1,
            };

            if (selectedType === "playlist") {
                vars.listType = "playlist";
                vars.list = selectedId;
            }

            playerRef.current = new window.YT.Player("yt-player", {
                height: "100%",
                width: "100%",
                videoId: selectedType === "video" ? selectedId : undefined,
                playerVars: vars,
                events: {
                    onReady: (e: any) => e.target.playVideo(),
                },
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }
    }, [selectedId, selectedType]);

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-2xl overflow-hidden">

            <div className="px-4 pt-4 pb-3 border-b border-gray-700">
                <p className="text-white font-semibold text-sm mb-2">🎵 Música</p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && search()}
                        placeholder="Buscar canción o playlist..."
                        className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg outline-none placeholder-gray-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                        onClick={search}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                        {loading ? "..." : "Buscar"}
                    </button>
                </div>

                {error && (
                    <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
            </div>

            {results.length > 0 && (
                <div className="overflow-y-auto max-h-64 border-b border-gray-700">
                    {results.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => select(r.id, r.type)}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition text-left"
                        >
                            <img
                                src={r.thumbnail}
                                alt={r.title}
                                className="w-12 h-9 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-medium truncate">
                                    {r.title}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                    {r.channelTitle}
                                    {r.type === "playlist" && (
                                        <span className="ml-1 text-indigo-400">· Playlist</span>
                                    )}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 relative" ref={playerContainerRef}>
                {selectedId ? (
                    <>
                        <div id="yt-player" className="absolute inset-0 w-full h-full" />
                        <button
                            onClick={clear}
                            className="absolute top-2 right-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80 transition"
                        >
                            ✕ Cerrar
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                        <span className="text-4xl">🎵</span>
                        <p className="text-sm">Busca algo para reproducir</p>
                    </div>
                )}
            </div>
        </div>
    );
}