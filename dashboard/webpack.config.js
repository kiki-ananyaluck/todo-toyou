const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'dashboard',

  exposes: {
    './Component': './src/app/app.ts',
    './Routes': './src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: false, 
      requiredVersion: false,
      eager: false 
    }),
  },

});
