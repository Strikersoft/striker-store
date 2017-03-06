import typescript from 'rollup-plugin-typescript';

const isESType = process.env.BUILD_TYPE === 'es';

export default {
  entry: 'lib/index.ts',
  dest: `build/${process.env.BUILD_TYPE}/striker-store.js`,
  format: `${process.env.BUILD_TYPE}`,
  moduleName: 'strikerStore',
  moduleId: 'striker-store',
  footer: '/* Coded with love at Strikersoft */',
  sourceMap: true,

  plugins: [
    typescript({
        typescript: require('typescript'),
        target: isESType ? 'es6' : 'es5'
    }),
  ],
  external: ['mobx', 'serializr']
}
