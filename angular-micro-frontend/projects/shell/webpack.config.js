const ModuleFederationPlugin = require("@module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      
      remotes: {
        "mfe1": "mfe1@http://localhost:4201/remoteEntry.js"
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
