// iOS 27 SDK asserts at launch unless the app adopts the UIScene life cycle.
// Expo SDK 57 ships `ExpoAppSceneDelegate` for this, but the prebuild template doesn't wire it up yet.
// Remove this plugin once `expo prebuild` generates a SceneDelegate on its own.
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const SCENE_DELEGATE = `
class SceneDelegate: ExpoAppSceneDelegate {}
`;

const withSceneAppDelegate = (config) =>
  withAppDelegate(config, (config) => {
    if (config.modResults.language !== 'swift') {
      throw new Error('withSceneLifecycle only supports a Swift AppDelegate');
    }
    let contents = config.modResults.contents;
    if (contents.includes('ExpoAppSceneDelegate')) {
      return config;
    }

    // The scene delegate reads the factory (and assigns the window) through this protocol.
    contents = contents.replace(
      'class AppDelegate: ExpoAppDelegate {',
      'class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'
    );

    // The scene delegate now creates the window and starts React Native.
    const windowStartup =
      /\n#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\)\n#endif\n/;
    if (!windowStartup.test(contents)) {
      throw new Error('withSceneLifecycle: could not find window startup block in AppDelegate.swift');
    }
    contents = contents.replace(windowStartup, '\n');

    config.modResults.contents = contents + SCENE_DELEGATE;
    return config;
  });

const withSceneManifest = (config) =>
  withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return config;
  });

module.exports = (config) => withSceneManifest(withSceneAppDelegate(config));
