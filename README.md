# 创建项目

要求node版本v18+

要求pnpm版本9.4.0+

- 安装pnpm

- 初始化并使用yaml配置项目的工作空间

    - pnpm init
    - touch pnpm-workspace.yaml

    ```yaml
    packages:
      - packages/*
      - playground
      - docs
    ```

- 新增 packages/vue 目录

    ```shell
    mkdir packages
    mkdir packages/vue
    cd packages/vue
    pnpm init
    ```

- 安装 `typescript` 依赖

    ```shell
    # 根目录下执行
    pnpm i typescript @types/node -Dw

    # 初始化
    npx tsc --init
    ```
- 安装代码规范

  ```shell
  pnpm i eslint @antfu/eslint-config -Dw

  cat <<EOF > eslint.config.mjs
  import antfu from '@antfu/eslint-config'

  export default antfu({
    ignores: ['/dist', '/node_modules', '/packages/**/dist', '/packages/**/node_modules'],
    rules: {
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'import/first': 'off',
      'import/order': 'off',
      'symbol-description': 'off',
      'no-console': 'warn',
      'max-statements-per-line': ['error', { max: 2 }],
      'vue/one-component-per-file': 'off',
    },
  })
  EOF

- 添加scripts

  ```sh
  npm set-script lint "eslint ."
  npm set-script lint:fix "eslint . --fix"
  ```
  新版本npm中set-script被弃用了，它仅在`7.24.2`~`8.19.4`中启用，如果找不到这个命令说明npm版本不支持，请在根目录package.json中手动添加
  ```json
  {
    "scripts": {
      "lint": "eslint .",
      "lint:fix": "eslint . --fix"
    }
  }
  ```

- 配置 simple-git-hooks 和 lint-staged

  ```shell
  pnpm i simple-git-hooks lint-staged -Dw
  ```

  在package.json的scripts中添加

    ```json
    {
      "scripts": {
        "prepare": "npx simple-git-hooks"
      },
      "lint-staged": {
        "*": "eslint --fix"
      }
    }
    ```

- 配置 @commitlint/config-conventional 和 @commitlint/cli

  ```sh
  pnpm i @commitlint/config-conventional @commitlint/cli -Dw
 ```

- 在 package.json 中添加配置和脚本
  ```json
  {
    "commitlint": {
      "extends": [
        "@commitlint/config-conventional"
      ]
    },
    "simple-git-hooks": {
      "pre-commit": "pnpm lint-staged",
      "commit-msg": "pnpm commitlint --edit ${1}"
    }
  }
  ```

创建组件工作空间

```
cd packages/vue
# 安装vue基础库
pnpm install vue -D
```

安装依赖

  ```
# vue-tsc 是对vue的TypeScript的封装，工作方式基本和tsc一致
pnpm install vue-tsc -D
pnpm install @vueuse/core -D
pnpm install typescript @tsconfig/node18 @vue/tsconfig -D
  ```

配置ts相关配置
```
# 新建tsconfig.json
cat <<EOF > tsconfig.json
{
  "files": [],
  "extends": ["./tsconfig.app.json"]
}
EOF

# 新建tsconfig.app.json
cat <<EOF > tsconfig.app.json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
    },
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "declaration": false,
    "lib": ["esnext", "dom"],
    "baseUrl": ".",
    "skipLibCheck": true,
    "outDir": "dist"
  }
}
EOF

# 新建tsconfig.build.json
cat <<EOF > tsconfig.build.json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
    },
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "declaration": false,
    "lib": ["esnext", "dom"],
    "baseUrl": ".",
    "skipLibCheck": true,
    "outDir": "dist"
  }
}
EOF

# 新建tsconfig.node.json
cat <<EOF > tsconfig.node.json
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*"
  ],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "types": ["node"]
  }
}
EOF
```

安装vite支持

```sh
pnpm install vite @vitejs/plugin-vue vite-plugin-dts -D
```

新建vite.config.ts，建议下面的操作使用vite cli来创建，这里使用手动创建只是方便理解原理。
```js
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      cleanVueFileName: true,
      exclude: ['src/test/**'],
    }),
  ],

  build: {
    lib: {
      name: 'vue3-ui-template',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
    },
  },
})
```
创建源码文件夹

```
mkdir src

cat <<EOF > src/index.ts
/**
 * 随机获取随机数
 * @param min 最小值
 * @param max 最大值
 * @param isFloat 是否允许小数
 * @returns 随机数
 */
const random = (min = 0, max = 100, isFloat = false) => {
    const array = new window.Uint32Array(1);
    const maxUint = 0xffffffff;
    const randomNumber = window.crypto.getRandomValues(array)[0] / maxUint;
    const randomRangeValue = (max - min + 1) * randomNumber + min;
    return isFloat ? randomRangeValue : window.Math.floor(randomRangeValue);
}

/**
 * 从数组中随机获取多个组成新数组
 * @param arr 数组
 * @param length 长度
 * @returns 随机获取的数组
 */
const randomTakeArrayFromArray = <T>(arr: T[] = [], length = 10) => {
    const result: T[] = [];
    // 组成的新数组初始化
    for (var i = 0; i < length; i++) {
        var index = random(0, arr.length - 1);
        var item = arr[index];
        result.push(item)
        arr.splice(index, 1)
    }
    return result
}

export { random, randomTakeArrayFromArray }

EOF
```

添加`build`命令

```
{
  "scripts": {
    "build": "vite build"
  }
}
```

配置export默认模块

```
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.umd.js",
      "import": "./dist/index.mjs"
    }
  },
  "main": "./dist/index.umd.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "typings": "./dist/index.d.ts",
}
```

添加测试套件`vitest`

```
pnpm install vitest -D
```

```shell
cat <<EOF > vitest.config.ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      '@': r('./src'),
    },
  },
  test: {
    environment: "jsdom"
  }
})
EOF
```

添加测试命令

```
{
  "script": {
    "test": "vitest",
  }
}
```

添加`src/index.test.ts`

```
cat <<EOF > src/index.test.ts
import { describe, expect, test, it } from 'vitest'
import { random, randomTakeArrayFromArray } from './index'

describe('测试', () => {
    test('函数返回值', () => {
        expect(random(1, 2)).lte(2).greaterThanOrEqual(1)
    })
})

EOF
```

这时候可以执行测试

```pnpm test
pnpm test
```

添加`vitepress`

```
# 先回到根目录
# 创建docs
cd docs
pnpm init
pnpm add -D vitepress
pnpm vitepress init
pnpm vitepress init
# 启动
pnpm docs:dev
```

创建测试组件目录

```shell
mkdir playground
# 创建nuxt项目
pnpm create vite
# 按照rimraf
pnpm install rimraf -Dw
```

添加命令

```
{
  "scripts": {
    "clear": "rimraf ./packages/**/dist",
    "build": "pnpm run clear && pnpm -r --filter=./packages/** run build",
  },
}
```

让项目自动生成changelist
```
# 安装 changesets
pnpm i @changesets/cli -Dw
# 初始化 changesets
pnpm changeset init
```

完成后项目会出现一个.changeset的文件夹

.changeset/config.json

```
cat <<EOF > .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [
  ]
}

EOF
```

添加 package.json 的发布脚本

```
{
    "script":
        "changeset": "changeset
        "vp": "changeset version",
        "release": "pnpm build && pnpm release:only",
        "release:only": "changeset publish"
    }
}
```
