const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "todo": "http://localhost:4201/remoteEntry.js",    
    "dashboard": "http://localhost:4202/remoteEntry.js"
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: false, 
      requiredVersion: false,
      eager: false 
    }),
  },
  
  sharedMappings: [],
  
}, 
{
  // output: {
  //   publicPath: 'auto',
  //   uniqueName: 'shell'
  // },
  // watchOptions: {
  //   aggregateTimeout: 1000,
  //   ignored: /node_modules/,
  // },
  devServer: {
    liveReload: false,
    hot: false,
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchFiles: {
      options: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.angular/**',
          '**/remoteEntry.js',
          '**/*.spec.ts',
          '**/.git/**'
        ],
        usePolling: false,
        poll: false
      },
    },
  }

});