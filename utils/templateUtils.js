const config = require("../templates.json");
const {InvalidArgumentError} = require("commander");
const log = require("./log");
const fsExtra = require('fs-extra');

/**
 * 打印 Logo
 */
const showLogo = () => {
    log.log(`
**************************************************
*         .__                         .__  .__   *
*    _____|__| _____             ____ |  | |__|  *
*   /  ___/  |/     \\   ______ _/ ___\\|  | |  |  *
*   \\___ \\|  |  Y Y  \\ /_____/ \\  \\___|  |_|  |  *
*  /____  >__|__|_|  /          \\___  >____/__|  *
*       \\/         \\/               \\/           *
*                                                *
**************************************************
`)
};

/**
 * 罗列所有模板名称
 * @returns {string[]}
 */
const templateNameList = () => {
    return Object.keys(config.tpl);
}

/**
 * 罗列所有模板配置详情
 * @returns {{name: string, type: 'git'|'local', path: '', default: boolean, branch: ''}[]}
 */
const templateList = () => {
    const tableData = [];
    templateNameList().forEach(key => tableData.push(config.tpl[key]))
    return tableData;
}

/**
 * 获取默认模板配置
 * @returns {{name: string, type: ("git"|"local"), path: "", default: boolean, branch: ""}}
 */
const getTemplateDefault = () => {
    if (templateList().some(item => item.default)) return templateList().find(item => item.default)
    templateList()[0].default = true;
    return templateList()[0];
}

/**
 * 检查模板名
 * @param name {string} 模板名
 * @param usedAs {'inquirer'|'argument'|'option'|'check'} 用作何处
 * @param exitStatus {boolean} 退出/提醒时机--存在时（true） 不存在时（false）
 * @param exitOrRemind {'exit'|'remind'} 退出/提醒
 */
const checkTemplateNameExit = (name= '', usedAs, exitStatus = false, exitOrRemind = 'remind') => {
    const isHasTemplate = !!config.tpl[name];
    const message = exitStatus && 'Template has already existed!' || 'Not found the template!';
    name = name.trim();
    if (usedAs === 'inquirer' && !name) throw new InvalidArgumentError('Template name is required!');

    if (isHasTemplate === exitStatus) {
        switch (usedAs) {
            case 'inquirer':
                if (exitOrRemind === 'remind') throw new InvalidArgumentError(message);
                else {
                    log.log('\n')
                    log.error(message)
                    process.exit()
                }
                break;
            case 'argument':
                if (exitOrRemind === 'remind') throw new InvalidArgumentError(message);
                else {
                    log.log('\n')
                    log.error(message)
                    process.exit()
                }
                break;
            case 'option':
                if (exitOrRemind === 'remind') throw new InvalidArgumentError(message);
                else {
                    log.log('\n')
                    log.error(message)
                    process.exit()
                }
                break;
            case 'check':
                log.log('\n')
                log.error(message)
                process.exit()
                break;
            default:
                log.log('\n')
                log.error(message)
                process.exit()
        }
    } else {
        switch (usedAs) {
            case 'inquirer':
                return true;
            case 'argument':
                return name;
            case 'option':
                return name;
            case 'check':
                break;
            default:
        }
    }
}

/**
 * 检查模板类型是否正确
 * @param type
 * @returns {boolean|string}
 */
const checkTemplateType = (type) => {
    if (['git', 'local'].some(item => item === type)) return type;
    throw new InvalidArgumentError('Template type can only be git or local.');
}

/**
 * 保存配置
 * @param configData
 * @returns {Promise<unknown>}
 */
const templateSave = (configData = config) => {
    getTemplateDefault()
    return new Promise((resolve = () => {}, reject = () => {}) => {
        fsExtra.outputFile(__dirname + '/../templates.json', JSON.stringify(configData), 'utf-8').then(() => {
            resolve();
        }).catch(err => {
            log.error(err);
            reject(err);
        })
    })
}

const formatterAnswers = (answers) => {
    Object.keys(answers).forEach(key => {
        if (typeof answers[key] === 'string') answers[key] = answers[key].trim();
    })
}

module.exports = {
    showLogo,
    templateNameList,
    templateList,
    getTemplateDefault,
    checkTemplateNameExit,
    checkTemplateType,
    templateSave,
    formatterAnswers,
}
