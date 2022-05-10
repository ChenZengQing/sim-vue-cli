'use strict'
const config = require('../templates')
const inquirer = require("inquirer");
const os = require("os");
const fsExtra = require('fs-extra');
const {InvalidArgumentError} = require("commander");
const download = require("download-git-repo");
const handlebars = require("handlebars");
const ora = require("ora");
const {getTemplateDefault, templateNameList, showLogo, formatterAnswers} = require("../utils/templateUtils");
const log = require("../utils/log");

const createSuccess = (spinner, projectConfig) => {
    spinner.succeed();
    // 模板文件列表
    const fileName = [
        `${projectConfig.name}/package.json`,
        `${projectConfig.name}/index.html`
    ];
    const removeFiles = [
        `${projectConfig.name}/.git`
    ]
    const meta = {
        name: projectConfig.name,
        version: projectConfig.version,
        description: projectConfig.description,
        author: projectConfig.author
    }
    fileName.forEach(item => {
        if (fsExtra.pathExistsSync(item)) {
            const content = fsExtra.readFileSync(item).toString();
            const result = handlebars.compile(content)(meta);
            fsExtra.outputFileSync(item, result);
        }
    });
    // 删除多余文件
    removeFiles.forEach(item => {
        fsExtra.removeSync(item);
    })

    showLogo();
    log.success(`Successfully created project ${projectConfig.name}.`)
    log.success('Get started with the following commands:\n')
    log.bash(`cd ${projectConfig.name} && npm install`)
}

const createProjectFromGit = (projectConfig) => {
    const spinner = ora('Download from template...');
    spinner.start();
    download(`direct:${projectConfig.template.path}#${projectConfig.template.branch}`, projectConfig.name, {clone: true}, function (err) {
        if (err) {
            spinner.fail();
            log.error(err)
        } else {
            createSuccess(spinner, projectConfig)
        }
        process.exit();
    })
}

const createProjectFromLocal = (projectConfig) => {
    const spinner = ora('Creating from template...');
    spinner.start();
    fsExtra.copy(projectConfig.template.path.trim(), `./${projectConfig.name}`)
        .then(() => {
            createSuccess(spinner, projectConfig)
            process.exit();
        })
        .catch(err => {
            spinner.fail()
            log.error(err)
            process.exit();
        })
}

const initProjectFromTemplate = (projectName = 'my-app', templateName = '') => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            default: projectName,
            message: 'Is sure the project name',
            validate: (input) => {
                if (!input) throw new InvalidArgumentError('project name is required!');
                if (fsExtra.pathExistsSync(input)) throw new InvalidArgumentError('directory already exists!');
                return true
            }
        },
        {
            name: 'version',
            default: '1.0.0',
            message: 'input the project version'
        },
        {
            name: 'description',
            default: projectName,
            message: 'input the project description'
        },
        {
            name: 'author',
            default: os.userInfo().username,
            message: 'input the project author'
        },
        {
            type: 'confirm',
            name: 'defaultTemplate',
            message: 'use the default template',
            when: !templateName
        },
        {
            type: 'list',
            name: 'templateName',
            default: templateNameList()[0],
            choices: templateNameList(),
            when: (answers) => {
                if (!templateName) return !answers.defaultTemplate;
                else return !templateNameList().some(item => item === templateName);
            },
            message: 'choose the project template',
        },
    ]).then(answers => {

        formatterAnswers(answers);

        const {projectName, version, description, author} = answers;

        let template = answers.templateName || templateName;

        if (answers.defaultTemplate) template = getTemplateDefault().name;

        const projectConfig = {name: projectName, version, description, author, template: config.tpl[template]}

        switch (projectConfig.template.type) {
            case 'git':
                createProjectFromGit(projectConfig);
                break;
            case 'local':
                createProjectFromLocal(projectConfig);
                break;
            default:
                log.warning('Type not supported yet!');
                process.exit();
        }
    }).catch(err => {
        log.error(err)
        process.exit()
    })
}

module.exports = {
    initProjectFromTemplate
}
