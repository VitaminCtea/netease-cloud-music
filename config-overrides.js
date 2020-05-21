const { override, addDecoratorsLegacy, addWebpackAlias } = require("customize-cra")
const path = require("path")

module.exports = override(
  addDecoratorsLegacy(),
  addWebpackAlias({
      ["@"]: path.resolve(__dirname, 'src'),
      ["actions"]: path.resolve(__dirname, 'src/actions'),
      ["api"]: path.resolve(__dirname, 'src/api'),
      ["common"]: path.resolve(__dirname, 'src/common'),
      ["components"]: path.resolve(__dirname, 'src/components'),
      ["containers"]: path.resolve(__dirname, 'src/containers'),
      ["helper"]: path.resolve(__dirname, 'src/helper'),
      ["icon"]: path.resolve(__dirname, 'src/icon'),
      ["reducers"]: path.resolve(__dirname, 'src/reducers'),
      ["hooks"]: path.resolve(__dirname, 'src/hooks'),
      ["constants"]: path.resolve(__dirname, 'src/constants')
  })
)