/*jshint jasmine: true, node: true */
'use strict';

const mock = require('mock-require');

describe('utils/config-resolver.js', () => {

  function setup(command, globResult, internal, argv) {
    mock('fs-extra', {
      existsSync: () => internal
    });

    mock('glob', {
      sync: () => globResult
    });

    const configResolver = mock.reRequire('../cli/utils/config-resolver');
    return configResolver.resolve(command, argv);
  }

  function testCommand(command, argv) {
    let _filename;
    mock('path', {
      resolve: (root, dir, platform, filename) => _filename = filename
    });

    setup(command, [], true, argv);
    return _filename;
  }

  it('should expose a resolve method', () => {
    const configResolver = require('../cli/utils/config-resolver');
    expect(configResolver.resolve).toBeDefined();
  });

  it('should handle finding zero external configurations', () => {
    const config = setup('test', [], false, {});
    expect(config).not.toBeDefined();
  });

  it('should handle finding one external configuration', () => {
    const result = 'external-file.js';
    const config = setup('test', [result], false, {});
    expect(config).toBe(result);
  });

  it('should handle finding multiple external configurations', () => {
    const results = [
      'one-too.js',
      'many-files.js'
    ];

    const config = setup('test', results, false, {});
    expect(config).not.toBeDefined();
  });

  it('should fallback to an internal config if it exists', () => {
    let resolveArgs = {};

    mock('path', {
      resolve: (root, dir, platform, filename) => {
        resolveArgs = {
          root: root,
          dir: dir,
          platform: platform,
          filename: filename
        };
        return 'resolved.js';
      }
    });

    const config = setup('test', [], true, {});
    expect(config).toBe('resolved.js');
    expect(resolveArgs.filename).toBe('config/karma/test.karma.conf.js');
  });

  it('should handle known karma commands', () => {
    ['test', 'watch'].forEach(command => {
      expect(testCommand(command, {})).toBe(`config/karma/${command}.karma.conf.js`);
    });
  });

  it('should handle the known protractor commands', () => {
    ['e2e', 'visual'].forEach(command => {
      expect(testCommand(command, {})).toBe(`config/protractor/protractor.conf.js`);
    });
  });

  it('should append the platform argument', () => {
    const custom = 'custom-platform';

    let _platform;
    mock('path', {
      resolve: (root, dir, platform) => _platform = platform
    });

    setup('test', [], true, { platform: custom });
    expect(_platform).toBe(custom);
  });
});
