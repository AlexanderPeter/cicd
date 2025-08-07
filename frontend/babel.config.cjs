module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  env: {
    coverage: {
      plugins: ['istanbul']
    }
  }
};
