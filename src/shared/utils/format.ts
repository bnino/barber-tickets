export const capitalizeWords = (text?: string) => {
    if (!text) return "";

    return text
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");
};