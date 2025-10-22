import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // 忽略特定文件
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
      'examples/**/*.js',
      'docs/**'
    ]
  },

  // JavaScript推荐规则
  js.configs.recommended,

  // TypeScript推荐规则
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 自定义规则
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // TypeScript规则
      '@typescript-eslint/no-explicit-any': 'warn',  // any类型警告
      '@typescript-eslint/explicit-function-return-type': 'off',  // 函数返回类型可选
      '@typescript-eslint/explicit-module-boundary-types': 'off',  // 模块边界类型可选
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',  // 忽略_开头的参数
        varsIgnorePattern: '^_',  // 忽略_开头的变量
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',  // 非空断言警告
      '@typescript-eslint/ban-ts-comment': 'warn',  // @ts-ignore等警告
      '@typescript-eslint/no-unsafe-assignment': 'off',  // 不安全赋值关闭（太严格）
      '@typescript-eslint/no-unsafe-member-access': 'off',  // 不安全成员访问关闭
      '@typescript-eslint/no-unsafe-call': 'off',  // 不安全调用关闭
      '@typescript-eslint/no-unsafe-return': 'off',  // 不安全返回关闭
      '@typescript-eslint/no-unsafe-argument': 'off',  // 不安全参数关闭
      '@typescript-eslint/require-await': 'warn',  // async函数必须有await
      '@typescript-eslint/no-floating-promises': 'warn',  // Promise必须处理
      '@typescript-eslint/no-misused-promises': 'warn',  // Promise误用

      // 通用规则
      'no-console': ['warn', {  // console使用警告（建议使用logger）
        allow: ['warn', 'error']
      }],
      'no-debugger': 'error',  // 禁止debugger
      'no-alert': 'warn',  // alert警告
      'prefer-const': 'warn',  // 优先使用const
      'no-var': 'error',  // 禁止var
      'eqeqeq': ['error', 'always'],  // 必须使用===
      'curly': ['error', 'all'],  // 始终使用大括号
      'no-throw-literal': 'error',  // 不要throw字面量
      'prefer-template': 'warn',  // 优先使用模板字符串
      'no-useless-concat': 'warn',  // 避免无用的字符串连接

      // 代码风格（由Prettier处理，这里只开警告）
      'indent': 'off',  // 由Prettier处理
      'quotes': 'off',  // 由Prettier处理
      'semi': 'off',  // 由Prettier处理
      'comma-dangle': 'off',  // 由Prettier处理
    }
  }
)


