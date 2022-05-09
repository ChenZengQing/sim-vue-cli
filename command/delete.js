'use strict'
const config = require('../templates')
const inquirer = require("inquirer");
const {checkTemplateNameExit, templateSave, templateNameList, formatterAnswers} = require("../utils/templateUtils");
const {listShowTemplates} = require("./list");
const log = require("../utils/log");

const removeTemplate = (name = '') => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                default: name,
                message: `${name ? 'Is' : 'Input'} the template name`,
                validate: (input) => checkTemplateNameExit(input, 'inquirer', false, 'exit')
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Confirm to remove this template',
                default: true
            },
        ])
        .then((answers) => {
            if (answers.confirm) {

                formatterAnswers(answers);

                if (templateNameList().length > 1) {
                    delete config.tpl[answers.name];
                    templateSave(config).then(() => {
                        log.log('\n');
                        log.success('Template removed!\n')
                        log.info('The last template list is: \n')
                        listShowTemplates();
                        log.log('\n');
                        process.exit();
                    }).catch(() => {
                        process.exit();
                    })
                } else {
                    log.error('At least one template needs to be retained!\n');
                    process.exit();
                }
            } else {
                log.warning('The operation was cancelled!\n')
                process.exit()
            }
        })
        .catch((error) => {
            if (error.isTtyError) {
                log.error(`Prompt couldn't be rendered in the current environment`)
            } else {
                log.error(error)
            }
        })
}

module.exports = {
    removeTemplate,
}
