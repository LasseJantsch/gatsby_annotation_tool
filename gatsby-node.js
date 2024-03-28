exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions
    if (page.path.match(/^\/annotation/)) {
      page.matchPath = "annotation/:id"
      createPage(page)
    }
  }