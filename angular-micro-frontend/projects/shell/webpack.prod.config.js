const { ModuleFederationPlugin } = require("webpack");

module.exports = {
  mode: "production",
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      
      remotes: {
        // No micro frontends configured
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
