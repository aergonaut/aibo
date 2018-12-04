module.exports = function(api) {
  api.cache(() => process.env.NODE_ENV);

  const presets = ["@babel/env", "@babel/preset-typescript"];
  const plugins = ["@babel/plugin-transform-runtime"];

  return {
    presets,
    plugins
  };
};
