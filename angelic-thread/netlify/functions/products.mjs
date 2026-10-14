const PRODUCT_DIR = "src/data/products";
const AUTHORIZED_EMAIL = "shubhamshewale498@gmail.com";
const ALLOWED_CATEGORIES = new Set(["Dresses", "Tops", "Kurtis", "Festive"]);

function json(statusCode, payload) {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function validSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function validateProduct(product) {
  if (!product || typeof product !== "object") return "Product data is required.";
  if (typeof product.title !== "string" || !product.title.trim() || product.title.length > 120) return "Title is required and must be at most 120 characters.";
  if (typeof product.price !== "string" || !product.price.trim() || product.price.length > 40) return "Price is required and must be at most 40 characters.";
  if (!ALLOWED_CATEGORIES.has(product.category)) return "Choose a valid category.";
  if (typeof product.image !== "string" || !product.image.trim() || product.image.length > 2048) return "A valid image URL is required.";
  if (typeof product.description !== "string" || product.description.length > 4000) return "Description must be at most 4000 characters.";
  return null;
}

export default async (request, context) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (!["PUT", "DELETE"].includes(request.method)) return json(405, { error: "Method not allowed." });

  const userEmail = context.clientContext?.user?.email?.toLowerCase();
  if (userEmail !== AUTHORIZED_EMAIL) return json(403, { error: "This account is not authorized to manage products." });

  const token = Netlify.env.get("GITHUB_TOKEN");
  const repository = Netlify.env.get("GITHUB_REPOSITORY");
  const branch = Netlify.env.get("GITHUB_BRANCH") || "main";
  if (!token || !repository || !/^[^/]+\/[^/]+$/.test(repository)) {
    return json(500, { error: "Product publishing is not configured. Set GITHUB_TOKEN and GITHUB_REPOSITORY in Netlify." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Request body must be valid JSON." });
  }
  if (!validSlug(body.slug)) return json(400, { error: "Product slug is invalid." });

  const path = `${PRODUCT_DIR}/${body.slug}.json`;
  const apiBase = `https://api.github.com/repos/${repository}/contents/${path}`;
  const headers = {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "x-github-api-version": "2022-11-28",
    "content-type": "application/json",
  };

  try {
    const currentResponse = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
    let sha;
    if (currentResponse.ok) {
      const current = await currentResponse.json();
      sha = current.sha;
    } else if (currentResponse.status !== 404) {
      const detail = await currentResponse.text();
      return json(currentResponse.status, { error: `Could not check product file: ${detail}` });
    }

    if (request.method === "DELETE") {
      if (!sha) return json(404, { error: "Product file does not exist." });
      const response = await fetch(apiBase, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ message: `Delete product ${body.slug}`, sha, branch }),
      });
      if (!response.ok) return json(response.status, { error: `Could not delete product: ${await response.text()}` });
      return json(200, { ok: true });
    }

    const problem = validateProduct(body.product);
    if (problem) return json(400, { error: problem });
    const content = Buffer.from(`${JSON.stringify(body.product, null, 2)}\n`).toString("base64");
    const response = await fetch(apiBase, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `${sha ? "Update" : "Add"} product ${body.slug}`,
        content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!response.ok) return json(response.status, { error: `Could not save product: ${await response.text()}` });
    return json(200, { ok: true });
  } catch (error) {
    console.error("Product publishing failed", error);
    return json(502, { error: "Could not reach GitHub. Please try again." });
  }
};
