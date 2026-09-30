import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Lexicon",
    slug: "lexicon-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "lexiconmobile",
    userInterfaceStyle: "automatic",
    ios: {
        icon: "./assets/expo.icon",
        bundleIdentifier: "com.lexiconenglish.app",
    },
    android: {
        package: "com.lexiconenglish.app",
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        predictiveBackGestureEnabled: false,
    },
    web: {
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        ["expo-font", {
            ios: {
                fonts: [
                    "node_modules/@expo-google-fonts/caprasimo/400Regular/Caprasimo_400Regular.ttf",
                    "node_modules/@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.ttf",
                    "node_modules/@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.ttf",
                    "node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf",
                    "node_modules/@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf",
                ],
            },
            android: {
                fonts: [
                    {
                        fontFamily: "Caprasimo",
                        fontDefinitions: [
                            { path: "node_modules/@expo-google-fonts/caprasimo/400Regular/Caprasimo_400Regular.ttf", weight: 400 },
                        ],
                    },
                    {
                        fontFamily: "Montserrat",
                        fontDefinitions: [
                            { path: "node_modules/@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.ttf", weight: 400 },
                            { path: "node_modules/@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.ttf", weight: 500 },
                            { path: "node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf", weight: 600 },
                            { path: "node_modules/@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf", weight: 700 },
                        ],
                    },
                ],
            },
        }],
        "./plugins/withSceneLifecycle",
        [
            "expo-splash-screen",
            {
                backgroundColor: "#208AEF",
                image: "./assets/images/splash-icon.png",
                imageWidth: 76,
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
});
