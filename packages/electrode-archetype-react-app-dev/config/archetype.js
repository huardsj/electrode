"use strict";

const Path = require("path");
const optionalRequire = require("optional-require")(require);
const userConfig = Object.assign({}, optionalRequire(Path.resolve("archetype/config")));
const { merge } = require("lodash");

const devPkg = require("../package.json");
const devDir = Path.join(__dirname, "..");
const devRequire = require(`../require`);
const configDir = `${devDir}/config`;
const xenvConfig = devRequire("xenv-config");
const detectCSSModule = require("./webpack/util/detect-css-module");
const _ = require("lodash");

const defaultOptimizeCssOptions = {
  cssProcessorOptions: {
    zindex: false
  }
};

const webpackConfigSpec = {
  devHostname: { env: ["WEBPACK_HOST", "WEBPACK_DEV_HOST"], default: "localhost" },
  devPort: { env: "WEBPACK_DEV_PORT", default: 2992 },
  testPort: { env: "WEBPACK_TEST_PORT", default: 3001 },
  reporterSocketPort: { env: "WEBPACK_REPORTER_SOCKET_PORT", default: 5000 },
  https: { env: "WEBPACK_DEV_HTTPS", default: false },
  devMiddleware: { env: "WEBPACK_DEV_MIDDLEWARE", default: false },
  cssModuleSupport: { env: "CSS_MODULE_SUPPORT", type: "truthy", default: detectCSSModule },
  cssModuleStylusSupport: { env: "CSS_MODULE_STYLUS_SUPPORT", default: false },
  cssLoaderModules: { env: "CSS_LOADER_MODULES", default: false },
  enableBabelPolyfill: { env: "ENABLE_BABEL_POLYFILL", default: false },
  enableNodeSourcePlugin: { env: "ENABLE_NODESOURCE_PLUGIN", default: false },
  woffFontInlineLimit: { env: "WOFF_FONT_INLINE_LIMIT", default: 1000 },
  preserveSymlinks: {
    env: ["WEBPACK_PRESERVE_SYMLINKS", "NODE_PRESERVE_SYMLINKS"],
    default: false
  },
  enableShortenCSSNames: { env: "ENABLE_SHORTEN_CSS_NAMES", default: false },
  optimizeCssOptions: {
    env: "OPTIMIZE_CSS_OPTIONS",
    type: "json",
    default: defaultOptimizeCssOptions
  },
  loadDlls: {
    env: "ELECTRODE_LOAD_DLLS",
    type: "json",
    default: {}
  },
  minify: {
    env: "WEBPACK_MINIFY",
    default: true
  },
  minifier: {
    env: "WEBPACK_MINIFIER",
    type: "string",
    // minifier is `uglify` or `terser`
    default: "uglify"
  }
};

const babelConfigSpec = {
  envTargets: {
    env: "BABEL_ENV_TARGETS",
    type: "json",
    default: {
      //`default` and `node` targets object is required
      default: {
        ie: "8"
      },
      node: process.versions.node.split(".")[0]
    }
  },
  target: {
    env: "ENV_TARGET",
    type: "string",
    default: "default"
  },
  // `extendLoader` is used to override `babel-loader` only when `hasMultiTargets=true`
  extendLoader: {
    env: "BABEL_EXTEND_LOADER",
    type: "json",
    default: {}
  }
};

const karmaConfigSpec = {
  browser: { env: "KARMA_BROWSER", default: "chrome" }
};

const topConfigSpec = {
  devOpenBrowser: { env: "ELECTRODE_DEV_OPEN_BROWSER", default: false }
};

const config = {
  devDir,
  devPkg,
  devRequire,
  webpack: xenvConfig(webpackConfigSpec, userConfig.webpack, { merge }),
  karma: xenvConfig(karmaConfigSpec, userConfig.karma, { merge }),
  jest: Object.assign({}, userConfig.jest),
  babel: xenvConfig(babelConfigSpec, userConfig.babel, { merge }),
  config: Object.assign(
    {},
    {
      babel: `${configDir}/babel`,
      eslint: `${configDir}/eslint`,
      istanbul: `${configDir}/istanbul`,
      karma: `${configDir}/karma`,
      mocha: `${configDir}/mocha`,
      webpack: `${configDir}/webpack`,
      jest: `${configDir}/jest`
    },
    userConfig.configPaths
  )
};

module.exports = Object.assign(
  config,
  xenvConfig(topConfigSpec, _.pick(userConfig, Object.keys(topConfigSpec)), { merge })
);

module.exports.babel.hasMultiTargets =
  Object.keys(module.exports.babel.envTargets)
    .sort()
    .join(",") !== "default,node";
