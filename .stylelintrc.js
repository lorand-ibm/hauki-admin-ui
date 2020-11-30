const absoluteUrl = (file) => `${__dirname}${file}`;

module.exports = {
  extends: "stylelint-config-standard",
  plugins: [
    "stylelint-value-no-unknown-custom-properties"
  ],
  rules: {
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ["extend", "include", "mixin"]
    }],
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        "importFrom": [
          absoluteUrl('/src/variables.css'),
          absoluteUrl('/node_modules/hds-core/lib/base.css')
        ]
      }
    ]
  }
}
