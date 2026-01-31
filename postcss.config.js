const path = require('path');

module.exports = {
    plugins: {
        [require.resolve("@tailwindcss/postcss", { paths: [__dirname] })]: {},
    },
};
