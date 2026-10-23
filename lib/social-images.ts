const image = {
  width: 1200,
  height: 630,
  alt: "Savartus | Manage. Store. Preserve.",
};

// Page-level social metadata replaces the layout's defaults rather than merging.
export const socialImages = {
  openGraph: [{ ...image, url: "/opengraph-image" }],
  twitter: [{ ...image, url: "/twitter-image" }],
};
