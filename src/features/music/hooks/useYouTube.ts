import { useState, useCallback } from "react";

type YouTubeApiItem = {
    id: {
        kind: string;
        videoId?: string;
        playlistId?: string;
    };
    snippet: {
        title: string;
        channelTitle: string;
        thumbnails: {
            default: { url: string };
        };
    };
};

export type SearchResult = {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    type: "video" | "playlist";
};

export function useYouTube() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<"video" | "playlist">("video");

    const search = useCallback(async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError("");

        try {
            const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video,playlist&maxResults=8&key=${apiKey}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                setError("Error al buscar. Verifica la API Key.");
                return;
            }

            const mapped: SearchResult[] = data.items.map((item: YouTubeApiItem) => ({
                id: item.id.videoId ?? item.id.playlistId ?? "",
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.default.url,
                channelTitle: item.snippet.channelTitle,
                type: item.id.kind === "youtube#playlist" ? "playlist" : "video",
            }));

            setResults(mapped);
        } catch {
            setError("Sin conexión o error de red");
        } finally {
            setLoading(false);
        }
    }, [query]);

    const select = useCallback((id: string, type: "video" | "playlist") => {
        setSelectedId(id);
        setSelectedType(type);
        setResults([]);
        setQuery("");
    }, []);

    const clear = useCallback(() => {
        setSelectedId(null);
        setResults([]);
        setQuery("");
    }, []);

    return {
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
    };
}