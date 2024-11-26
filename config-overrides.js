const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { override, addWebpackPlugin } = require('customize-cra');

module.exports = override(
  addWebpackPlugin(
    new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp'],
    })
  )
);
