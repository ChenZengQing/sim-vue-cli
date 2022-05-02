# sim-vue-cli

## 安装

```bash
npm install -g sim-vue
# OR
yarn global add sim-vue
```

安装之后可通过运行 `sim` 或以下命令来验证是否安装成功

```bash
C:\Users\XiaoChen>sim

**************************************************
*         .__                         .__  .__   *
*    _____|__| _____             ____ |  | |__|  *
*   /  ___/  |/     \   ______ _/ ___\|  | |  |  *
*   \___ \|  |  Y Y  \ /_____/ \  \___|  |_|  |  *
*  /____  >__|__|_|  /          \___  >____/__|  *
*       \/         \/               \/           *
*                                                *
**************************************************

Usage: sim <command> [options]

Build a new project based on the project template

Options:
  -v, --version                                output the version number
  -a, --add [name...]                          Create a new project template
  -r, --remove [name...]                       Remove a template
  -l, --list                                   List all of project templates
  -i, --init [name...]                         Build a new project from template
  -h, --help                                   display help for command

Commands:
  add [options] [name] [type] [path]           Create a new project template
  remove [options] [name]                      Remove a template
  list                                         List all of project templates
  init [options] [projectName] [templateName]  Build a new project from a template

C:\Users\XiaoChen>sim --version
1.0.1
```

## 升级

```bash
npm update -g sim-vue
# 或者
yarn global upgrade --latest sim-vue
```

## 使用

### 查看所有模板

使用 `sim -l|--list|list` 命令可查看预设的模板列表信息

```bash
C:\Users\XiaoChen>sim -l

**************************************************
*         .__                         .__  .__   *
*    _____|__| _____             ____ |  | |__|  *
*   /  ___/  |/     \   ______ _/ ___\|  | |  |  *
*   \___ \|  |  Y Y  \ /_____/ \  \___|  |_|  |  *
*  /____  >__|__|_|  /          \___  >____/__|  *
*       \/         \/               \/           *
*                                                *
**************************************************

┌─────────┬───────────┬───────┬────────────────────────────────────────────────────────┬─────────┬──────────┐
│ (index) │   name    │ type  │                          path                          │ default │  branch  │
├─────────┼───────────┼───────┼────────────────────────────────────────────────────────┼─────────┼──────────┤
│    0    │ 'sim-vue' │ 'git' │ 'https://github.com/ChenZengQing/sim-vue-template.git' │  true   │ 'master' │
└─────────┴───────────┴───────┴────────────────────────────────────────────────────────┴─────────┴──────────┘
```

### 新增模板

通过 `sim -a|--add|add [name] [type] [path]` 可新增一条模板配置

| 配置项   | 是否必传 | 类型               | 示例                                                      | 描述          |
|-------|------|------------------|---------------------------------------------------------|-------------|
| name  | 否    | string           | 'my-app'                                                | 模板名称        |
| type  | 否    | ['git', 'local'] | 'git'                                                  | 仓库类型，本地或远程仓库 |
| path  | 否    | string           | 'https://github.com/ChenZengQing/sim-vue-template.git' | 模板仓库地址      |

具体使用方式如下

```bash
sim -a
# or
sim --add
# or
sim add
```

亦可提前输入参数，如下

```bash
sim -a template1 git https://xxxxxx
# or
sim --add template1 git https://xxxxxx
# or
sim add template1 git https://xxxxxx
# 或指定参数
sim add -n template1 -t git -p https://xxxxxx
```

### 删除模板配置

通过 `sim -r|--remove|remove [name]` 可删除一条模板配置

| 配置项   | 是否必传 | 类型      | 示例         | 描述    |
|-------|------|---------|------------|-------|
| name  | 否    | string  | 'sim-vue'  | 模板名称  |

具体使用方式如下

```bash
sim -r
# or
sim --remove
# or
sim remove
```

亦可提前输入参数，如下

```bash
sim -r template1
# or
sim --remove template1
# or
sim remove template1
# 或指定参数
sim remove -n template1
```

### 构建项目

通过 `sim -i|--init|init [projectName] [templateName] ` 可依据指定模板或默认模板生成新项目

| 配置项          | 是否必传 | 类型     | 示例         | 描述    |
|--------------|:----:|--------|------------|-------|
| projectName  |  否   | string | 'my-app'   | 新项目名称 |
| templateName |  否   | string | 'sim-vue'  | 模板名称  |


具体使用方式如下

```bash
sim -i
# or
sim --init
# or
sim init
```

亦可提前输入参数，如下

```bash
sim -i my-app sim-vue
# or
sim --init my-app sim-vue
# or
sim init my-app sim-vue
# 或指定参数
sim init -p my-app -t sim-vue
```

> `sim` 各命令均可不携带任何参数进行使用，同时也可追加 `-h` 查看帮助信息。

## 卸载

```bash
npm uninstall -g sim-vue
```