'use strict'
const {addTemplate} = require("./add");
const {removeTemplate} = require("./delete");
const {listShowTemplates} = require("./list");
const {initProjectFromTemplate} = require("./init");

module.exports = {
    addTemplate,
    removeTemplate,
    listShowTemplates,
    initProjectFromTemplate,
}
