#!/usr/bin/env node --harmony
'use strict'
const { program } = require('commander');
const pkg = require('../package.json')
const updateNotifier = require('update-notifier')
const {addTemplate, removeTemplate, listShowTemplates, initProjectFromTemplate} = require("../command");
const {checkTemplateType, showLogo} = require("../utils/templateUtils");
updateNotifier({ pkg }).notify({ isGlobal: true })

program
	.version(pkg.version, '-v, --version')
	.option('-a, --add [name...]', 'Create a new project template')
	.option('-r, --remove [name...]', 'Remove a template')
	.option('-l, --list', 'List all of project templates')
	.option('-i, --init [name...]', 'Build a new project from template')
	.usage('<command> [options]')
	.description('Build a new project based on the project template')
	.action((options) => {
		if (options.add) addTemplate({name: options.add[0], type: options.add[1], path: options.add[2]});
		if (options.remove) removeTemplate(options.remove[0]);
		if (options.list) listShowTemplates(true);
		if (options.init) initProjectFromTemplate(options.init[0], options.init[1]);
	})

program
	.command('add')
	.argument('[name]', 'the template name', '')
	.argument('[type]', 'the template type of git or local', checkTemplateType, '')
	.argument('[path]', 'the template path for gitUrl or localPath', '')
	.option('-n, --name <name>', 'the template name', '')
	.option('-t, --type <type>', 'the template type of git or local', checkTemplateType, '')
	.option('-p, --path <path>', 'the template path for git or local', '')
	.description('Create a new project template')
	.action((name, type, path, options) => {addTemplate({name, type, path}, options)})

program
	.command('remove')
	.argument('[name]', 'the template name', '')
	.option('-n, --name <name>', 'the template name', '')
	.description('Remove a template')
	.action((name, options) => {removeTemplate(name || options.name)})

program
	.command('list')
	.description('List all of project templates')
	.action(() => listShowTemplates(true))

program
	.command('init')
	.description('Build a new project from a template')
	.argument('[projectName]', 'the project name', '')
	.argument('[templateName]', 'the template name', '')
	.option('-p, --projectName <name>', 'the project name', '')
	.option('-t, --templateName <name>', 'the template name', '')
	.action((projectName, templateName, options) => {
		initProjectFromTemplate(options.projectName || projectName, options.templateName || templateName)
	})

program.parse(process.argv);

if (!program.args.length && !Object.keys(program.opts()).length) {
	showLogo()
	program.help()
}


