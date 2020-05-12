"use strict";
const pkgContent = require("../package.json");
const { setupSubAppHapiRoutes } = require("./setup-hapi-routes");
const { setupSubAppFastifyRoutes } = require("./fastify-plugin");

const { universalHapiPlugin } = require("electrode-hapi-compat");

const registers = {
    hapi17OrUp: setupSubAppHapiRoutes,
    hapi16: setupSubAppHapiRoutes,
    fastify: setupSubAppFastifyRoutes
};

module.exports = universalHapiPlugin(registers, pkgContent);
