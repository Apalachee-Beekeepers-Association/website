import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import eleventyFontAwesomePlugin from "@11ty/font-awesome";
import eleventyAutoCacheBuster  from "eleventy-auto-cache-buster";
import CleanCSS from "clean-css";

// See https://moment.github.io/luxon/#/zones?id=specifying-a-zone
const TIME_ZONE = "America/New_York";

export default async function (eleventyConfig) {
	// hierarchical navigation plugin
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	// fontawesome icons plugin
	eleventyConfig.addPlugin(eleventyFontAwesomePlugin);
	// cache bust assets based on hash
	eleventyConfig.addPlugin(eleventyAutoCacheBuster);

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "style",
		transforms: [
			// minify css
			function (content) {
				return new CleanCSS({}).minify(content).styles;
			}
		]
	});

	// Dates should render as EST by default
	eleventyConfig.addDateParsing(function(dateValue) {
		let localDate;
		if(dateValue instanceof Date) { // and YAML
			localDate = DateTime.fromJSDate(dateValue, { zone: "utc" }).setZone(TIME_ZONE, { keepLocalTime: true });
		} else if(typeof dateValue === "string") {
			localDate = DateTime.fromISO(dateValue, { zone: TIME_ZONE });
		}
		if (localDate?.isValid === false) {
			throw new Error(`Invalid \`date\` value (${dateValue}) is invalid for ${this.page.inputPath}: ${localDate.invalidReason}`);
		}
		return localDate;
	});

	// Bundle <script> content and adds a {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		// Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "script",
	});

	// expose the build date
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Copy `admin/` to `_site/admin/`
	eleventyConfig.addPassthroughCopy({ "static": "/" });

	// liquid needs an explicit list of allowed references to allow including folders like node_modules
	// https://github.com/11ty/eleventy/issues/3502#issuecomment-2436040052
	eleventyConfig.setLiquidOptions({
		root: ['./content', './_includes', '.']
	});
};

export const config = {
	dir: {
		input: "content",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "../_data",          // default: "_data" (`input` relative)
		output: "_site"
	}
};
