const GET = async (event) => {
  const imageUrl = event.url.searchParams.get("imageUrl");
  if (!imageUrl) {
    return new Response("Missing imageUrl", { status: 400 });
  }
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      return new Response("Failed to fetch image", { status: res.status });
    }
    const blob = await res.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-D7nA-pzj.js.map
