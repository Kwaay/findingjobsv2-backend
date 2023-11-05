/**
 * @file Configuration file for Babel.
 * @author DUMONT Benoit <benoit.dumont@contakt.eco>
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    [
      'module-resolver',

      {
        root: ['./src'],
        alias: {
          $src: './src',
        },
      },
    ],
  ],
};
