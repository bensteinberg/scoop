import chalk from 'chalk'

/**
 * Library-wide constants for Mischief.
 * @property {string} SOFTWARE - Used in provenance data to indicate which softare made the capture.
 * @property {string} VERSION - Current version of Mischief. Also used in provenance data.
 * @property {string} WARC_VERSION - Spec version to be used when exporting to WARC.
 * @property {string} WACZ_VERSION - Spec version to be used when exporting to WACZ.
 * @property {object} LOGGING_COLORS - Colors (from the chalk library) to be used for logging purposes.
 * @property {string} ASSETS_PATH - Path to the "assets" folder.
 * @property {string} TEMPLATES_PATH - Path to the "templates" folder.
 * @property {string} TMP_PATH - Path to the "temporary" folder.
 */
export default {
  SOFTWARE: 'Mischief @ Harvard Library Innovation Lab',
  VERSION: 'v0.0.1 DEV',
  WARC_VERSION: '1.1',
  WACZ_VERSION: '1.1.1',
  LOGGING_COLORS: {
    DEFAULT: chalk.gray,
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red
  },
  ASSETS_PATH: `${process.env.PWD}/assets/`,
  TEMPLATES_PATH: `${process.env.PWD}/assets/templates/`,
  TMP_PATH: `${process.env.PWD}/tmp/`
}
