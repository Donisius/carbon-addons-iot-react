module.exports = {
  collectCoverageFrom: [
    'src/components/**/*.js?(x)',
    '!src/**/*.story.js?(x)',
    '!src/**/hooks/*.js',
    '!src/components/SuiteHeader/util/suiteHeaderData.js',
    '!src/components/FileUploader/stories/*.jsx',
    '!src/components/Table/AsyncTable/*.js?(x)',
    '!src/components/WizardInline/**/*.js?(x)',
    '!src/components/Page/(EditPage|PageHero).jsx',
    '!src/components/Dashboard/(Dashboard|CardRenderer).jsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/coverage/'],
  coverageReporters: ['html', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    './src/components/**/!(TimeSeriesCard|BarChartCard|DashboardEditor).jsx': {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    './src/components/DashboardEditor/DashboardEditor.jsx': { branches: 65, functions: 71 },
    './src/components/BarChartCard/BarChartCard.jsx': {
      // TODO: Add tests for tooltip interaction and formatting when below issue is solved
      // https://github.com/carbon-design-system/carbon-charts/issues/594
      functions: 69,
    },
    './src/components/TimeSeriesCard/TimeSeriesCard.jsx': {
      // TODO: Add tests for tooltip interaction and formatting when below issue is solved
      // https://github.com/carbon-design-system/carbon-charts/issues/594
      functions: 77,
    },
  },
  globals: {
    __DEV__: false,
  },
  setupFiles: ['<rootDir>/config/jest/setup.js'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupTest.js'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js?(x)',
    '<rootDir>/**/?(*.)(spec|test).js?(x)',
    '<rootDir>/**/?(*.)test.a11y.js?(x)',
  ],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.story\\.jsx?$': '@storybook/addon-storyshots/injectFileName',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.s?css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  testPathIgnorePatterns: ['/config/', '/lib/'],
  transformIgnorePatterns: ['/node_modules/(?!(@carbon/charts)).+(.jsx?)', '/__mocks__/.+(.jsx?)'],
  watchPathIgnorePatterns: ['/coverage/', '/results/', '/.git/'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    // rewrite carbon-components(-react) es imports to lib/cjs imports because jest doesn't support es modules
    '@carbon/icons-react/es/(.*)': '@carbon/icons-react/lib/$1',
    'carbon-components-react/es/(.*)': 'carbon-components-react/lib/$1',
  },
};
