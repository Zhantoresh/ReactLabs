export async function checkConnection() {
  try {
    const url = `${import.meta.env.BASE_URL}sw.js?connection-check=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}