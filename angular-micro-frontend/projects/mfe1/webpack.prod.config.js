const { ModuleFederationPlugin } = require("webpack");

module.exports = {
  mode: "production",
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe1",
      filename: "remoteEntry.js",
      
      exposes: {
        './Module': './projects/mfe1/src/app/remote-entry/entry.module.ts'
      },
      
      shared: {
        "@angular/core": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto"
        },
        "@angular/common": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto"
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto"
        },
        "@angular/router": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto"
        },
        "@ngrx/store": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto"
        },
        "@ngrx/effects": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "auto"
        }
      }
    })
  ]
};
