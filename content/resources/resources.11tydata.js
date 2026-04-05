export default {
  layout: "layouts/default.liquid",
  tags: ["resources"],
  eleventyComputed: {
    eleventyNavigation: (data) => {
      return {
        parent: "Resources",
        key: data.title,
      };
    },
  },
};
