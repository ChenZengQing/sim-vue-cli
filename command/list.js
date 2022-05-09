'use strict'
const {showLogo, templateList} = require("../utils/templateUtils");
const log = require("../utils/log");

const listShowTemplates = (withLogo) => {
    withLogo && showLogo();
    log.table(templateList())
    process.exit()
}

module.exports = {
    listShowTemplates,
}

