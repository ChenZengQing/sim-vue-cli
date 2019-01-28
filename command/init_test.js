'use strict'
const exec = require('child_process').exec
const co = require('co')
const fs = require('fs');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const os = require('os');

module.exports = (name) => {
  co(function* () {
    if (!fs.existsSync(name)) {
      // 处理用户输入
      inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          default: 'h5',
          choices: ['h5', 'pc'],
          message: '请选择项目类型',

        },
        {
          name: 'version',
          default: '1.0.0',
          message: '请输入项目版本号'
        },
        {
          name: 'description',
          default: name,
          message: '请输入项目描述'
        },
        {
          name: 'author',
          default: os.userInfo().username,
          message: '请输入项目作者'
        },
      ]).then((answers) => {
        const spinner = ora('正在下载模板...\n');
        spinner.start();

        let repository = '';
        if (answers.type === 'h5') {
          repository = 'sim-vue-template';
        } else { 
          repository = 'sim-vue-template-pc';
        }


        download(`direct:https://github.com/ChenZengQing/${repository}.git`, name, { clone: true }, (err) => {
          if (err) {
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.succeed();
            const fileName = [
              `${name}/package.json`,
              `${name}/index.html`
            ];
            const meta = {
              name,
              version: answers.version,
              description: answers.description,
              author: answers.author
            }
            fileName.forEach(item => {
              if (fs.existsSync(item)) {
                const content = fs.readFileSync(item).toString();
                const result = handlebars.compile(content)(meta);
                fs.writeFileSync(item, result);
              }
            });
            // console.log(symbols.success, chalk.green('模板下载完成开始初始化'));
            const spinnerBuild = ora('模板下载完成开始初始化...\n');
            spinnerBuild.start();
            exec(`cd ${name} && npm install`, (error, stdout, stderr) => {
              // console.log(error,stdout,stderr)
              if (error) {
                spinnerBuild.fail();
                console.log(error)
                process.exit()
              }
              // startBuildProject(spinnerBuild,name)
              spinnerBuild.succeed();
              console.log(symbols.success, chalk.green('项目初始化成功'));
              process.exit()
            }).stdout.on('data', (data) => {
              // console.log(`${data}`);
            });

            function startBuildProject(spanner,projectName){
              let targetPath = process.cwd() + "/" + projectName;
              // util.copyDirSync(__dirname + '/download', targetPath)
              console.log(__dirname+'/download',targetPath)
              console.log('    ','----------------------------------------')
              console.log('    ',chalk.green('★'),chalk.green('项目构建成功'));
              spanner.stop();
              process.exit(0);
          }
          }
        })
      })
    } else {
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })
}

