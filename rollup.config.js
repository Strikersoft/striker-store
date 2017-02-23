import typescript from 'rollup-plugin-typescript';
import babili from 'rollup-plugin-babili';
import uglify from 'rollup-plugin-uglify';

const isESType = process.env.BUILD_TYPE === 'es';

export default {
  entry: 'lib/index.ts',
  dest: `build/${process.env.BUILD_TYPE}/striker-store.js`,
  format: `${process.env.BUILD_TYPE}`,
  moduleName: 'strikerStore',
  moduleId: 'striker-store',
  footer: '/* Coded with love in Strikersoft */',
  sourceMap: true,

  plugins: [
    typescript({
        typescript: require('typescript'),
        target: isESType ? 'es6' : 'es5'
    }),
    // isESType ? babili() : uglify()
  ],
  external: ['mobx', 'serializr']
}
