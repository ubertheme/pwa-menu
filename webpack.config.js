const {
    configureWebpack,
    graphQL: { getMediaURL, getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
// Plugin to override modules
const NormalModuleOverridePlugin = require('./src/plugins/normalModuleOverrideWebpackPlugin');
const parentPackagePath = path.resolve(
    process.cwd() + '/../venia-ui'
);
const componentOverrideMapping = {
    [`${parentPackagePath}/lib/components/Main`]: 'src/lib/components/Main',
    [`${parentPackagePath}/lib/components/Navigation`]: 'src/lib/components/Navigation'
};
// Aliases to parent package
const veniaUi = path.resolve(__dirname + '/../venia-ui');
const veniaConcept = path.resolve(__dirname + '/../venia-concept');

module.exports = async env => {
    const mediaUrl = await getMediaURL();

    global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const { clientConfig, serviceWorkerConfig } = await configureWebpack({
        context: __dirname,
        vendor: [
            '@apollo/react-hooks',
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
            'informed',
            'react',
            'react-dom',
            'react-feather',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk'
        ],
        special: {
            'react-feather': {
                esModules: true
            },
            '@magento/peregrine': {
                esModules: true,
                cssModules: true
            },
            '@magento/venia-ui': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                rootComponents: true,
                upward: true
            }
        },
        env
    });

    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    clientConfig.module.noParse = [/braintree\-web\-drop\-in/];
    clientConfig.plugins = [
        ...clientConfig.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('UB PWA Menu')
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ];

    /**
     * Extend the default configuration from venia-concept
     */
    //test: /\.graphql$/
    clientConfig.module.rules[0].include.push(veniaUi, veniaConcept);
    // test: /\.(mjs|js)$/
    clientConfig.module.rules[1].include.push(veniaUi, veniaConcept);
    //test: /\.css$/
    clientConfig.module.rules[2].oneOf[0].test.push(veniaUi, veniaConcept);
    //custom aliases
    clientConfig.resolve.alias = Object.assign(clientConfig.resolve.alias, {
        '~veniaUi': veniaUi,
        '~veniaConcept': `${veniaConcept}/src`
    });
    clientConfig.resolve.modules.push(veniaUi, veniaConcept);
    clientConfig.plugins.push(
        new NormalModuleOverridePlugin(componentOverrideMapping)
    );

    return [clientConfig, serviceWorkerConfig];
};
