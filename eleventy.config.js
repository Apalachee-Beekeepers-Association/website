export default async function(eleventyConfig) {
	// Copy `admin/` to `_site/admin/`
	eleventyConfig.addPassthroughCopy("admin");
};

export const config = {
  dir: {
    input: "content",          // default: "."
    includes: "../_includes",  // default: "_includes" (`input` relative)
    data: "../_data",          // default: "_data" (`input` relative)
    output: "_site"
  }
};