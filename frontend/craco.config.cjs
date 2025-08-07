module.exports = {
  babel: {
    loaderOptions: (babelLoaderOptions) => {
      if (process.env.NODE_ENV === 'coverage') {
        babelLoaderOptions.plugins = (babelLoaderOptions.plugins || []).concat('istanbul');
      }
      return babelLoaderOptions;
    }
  }
};
