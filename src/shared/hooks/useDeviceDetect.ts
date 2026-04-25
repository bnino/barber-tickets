export function useDeviceDetect() {
  const ua = navigator.userAgent.toLowerCase();

  const isTVByAgent =
    /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast|viera|nettv|roku|opera tv|silk|tizen|webos/.test(ua) ||
    /tv|television/.test(ua);

    // fallback: si la URL tiene ?tv también cuenta
  const isTVByParam = new URLSearchParams(window.location.search).has("tv");

  return { isTV: isTVByAgent || isTVByParam };
}