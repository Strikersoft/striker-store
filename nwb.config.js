module.exports = {
  type: 'react-component',
  babel: {
    runtime: true
  },
  npm: {
    esModules: true,
    umd: {
      global: 'striker-store',
      externals: {
        react: 'React',
        mobx: 'mobx',
        'mobx-react': 'mobx-react',
        'mobx-utils': 'mobx-utils',
        serializr: 'serializr'
      }
    }
  }
}
