module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended", "plugin:import/no-cycle",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
		"import/no-cycle": [2, { maxDepth: 10}],
		"import/no-unresolved": [2, {commonjs: true, amd: true}]
    }
};
