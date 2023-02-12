const path = require('path');

const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    outputDir: './build',
    transpileDependencies: true,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', path.resolve(__dirname, 'src'))
            .set('components', '@/components');
    },
});
