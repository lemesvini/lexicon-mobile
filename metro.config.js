const { getPostHogExpoConfig } = require("posthog-react-native/metro");
const { withNativeWind } = require("nativewind/metro");

// PostHog's config is Expo's default plus the source-map serializer that error
// tracking needs; NativeWind goes on top of it, not on getDefaultConfig.
const config = getPostHogExpoConfig(__dirname);
module.exports = withNativeWind(config, { input: "./src/global.css" });
