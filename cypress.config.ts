import { defineConfig } from "cypress";
import * as Webpack from "webpack";
import { devServer } from "@cypress/webpack-dev-server";
import webpackPreprocessor from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

//

const webpackConfig = (
  cypressConfig: Cypress.PluginConfigOptions
): Webpack.Configuration => {
  return {
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: "ts-loader",
              options: { transpileOnly: true },
            },
          ],
        },
        {
          test: /\.feature$/,
          use: [
            {
              loader: "@badeball/cypress-cucumber-preprocessor/webpack",
              options: cypressConfig,
            },
          ],
        },
      ],
    },
  };
};

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  const options = {
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".js"],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: "ts-loader",
              },
            ],
          },
          {
            test: /\.feature$/,
            use: [
              {
                loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                options: config,
              },
            ],
          },
        ],
      },
    },
  };

  on("file:preprocessor", webpackPreprocessor(options));

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  component: {
    specPattern: "**/*.feature",
    supportFile: false,
    devServer(devServerConfig) {
      return devServer({
        ...devServerConfig,
        framework: "react",
        webpackConfig: webpackConfig(devServerConfig.cypressConfig),
      });
    },
    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more.
      await addCucumberPreprocessorPlugin(on, config);

      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
  },

  e2e: {
    specPattern: "**/*.feature",
    supportFile: false,
    setupNodeEvents,
  },

  // e2e: {
  //   setupNodeEvents(on, config) {
  //     // implement node event listeners here
  //   },
  // },
});
