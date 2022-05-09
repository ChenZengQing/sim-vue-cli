'use strict'
const inquirer = require("inquirer");
const config = require('../templates');
const {checkTemplateNameExit, templateSave, templateList, formatterAnswers} = require("../utils/templateUtils");
const {InvalidArgumentError} = require("commander");
const {listShowTemplates} = require("./list");
const log = require("../utils/log");

const templateObject = {
    name: '',
    type: 'git',
    path: '',
}

/**
 * 新增模板
 * @param template {{path: string, name: string, type: 'git'|'local'}}
 * @param options {{path: string, name: string, type: 'git'|'local'}}
 */
const addTemplate = (template = templateObject, options = templateObject) => {
    const checkedObject = {
        name: options.name || template.name,
        type: options.type || template.type,
        path: options.path || template.path,
        branch: 'master',
        default: true,
    };

    checkTemplateNameExit(checkedObject.name, 'check', true)

    const buildQuestion = (value, key) => {
        return `${value && 'Make sure' || 'Input'} the ${key} for the template`
    }

    const questionList = [
        {
            name: 'name',
            default: checkedObject.name,
            type: 'input',
            message: buildQuestion(checkedObject.name, 'name'),
            validate: (input) => checkTemplateNameExit(input, 'inquirer', true),
        },
        {
            type: 'list',
            choices: ['git', 'local'],
            name: 'type',
            default: checkedObject.type,
            message: buildQuestion(checkedObject.type, 'type'),
        },
        {
            type: 'editor',
            name: 'path',
            default: checkedObject.path,
            message: buildQuestion(checkedObject.path, 'path'),
            validate: (input) => {
                if (!input.trim()) throw new InvalidArgumentError('Template path is required!');
                return true;
            }
        },
        {
            name: 'branch',
            default: 'master',
            message: buildQuestion(checkedObject.branch, 'branch'),
            validate: (input) => {
                if (!input.trim()) throw new InvalidArgumentError('Template branch is required!');
                return true;
            },
            when: (answer) => answer.type === 'git'
        },
        {
            type: 'confirm',
            name: 'default',
            default: true,
            message: 'Do you want to set it as the default option'
        }
    ];

    inquirer
        .prompt(questionList)
        .then(answers => {

            formatterAnswers(answers);

            if (answers.default) {
                templateList().forEach(item => item.default = false);
            }

            config.tpl[answers.name] = {...answers, path: answers.path.replace(/[\u0000-\u0019]/g, '')};

            templateSave(config).then(() => {
                log.log('\n');
                log.success('New template added!\n');
                log.info('The last template list is: \n')
                listShowTemplates();
                log.log('\n')
                process.exit()
            }).catch(() => {
                process.exit()
            })
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
    addTemplate,
}
