import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Lexicon",
    slug: "lexicon-app",
    owner: "lemesvini",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon-light.png",
    scheme: "lexiconmobile",
    userInterfaceStyle: "automatic",
    ios: {
        icon: {
            light: "./assets/images/app-icon-light.png",
            dark: "./assets/images/app-icon-dark.png",
        },
        bundleIdentifier: "com.lexiconenglish.app",
        config: { usesNonExemptEncryption: false },

    },
    android: {
        package: "com.lexiconenglish.app",
        // FCM, which delivers push notifications on Android.
        googleServicesFile: "./google-services.json",
        // The foreground is the splash wordmark on a transparent canvas, sized
        // to stay inside the round mask; the background matches app-icon-light.
        adaptiveIcon: {
            backgroundColor: "#DFF2EA",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            monochromeImage: "./assets/images/android-icon-foreground.png",
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
        "expo-sqlite",
        // Practice › Speaking: the student says each card out loud and the
        // device's own recognizer checks it.
        ["expo-speech-recognition", {
            microphonePermission:
                "O Lexicon usa o microfone para ouvir você falar em inglês nas práticas de speaking.",
            speechRecognitionPermission:
                "O Lexicon usa o reconhecimento de fala para conferir o que você disse nas práticas de speaking.",
            androidSpeechServicePackages: ["com.google.android.googlequicksearchbox"],
        }],
        // Push and the daily practice reminder. Android draws the small icon
        // from its alpha alone, so the transparent wordmark comes out as a
        // white silhouette, tinted with the brand green in the shade.
        ["expo-notifications", {
            icon: "./assets/images/android-icon-foreground.png",
            color: "#61b495",
        }],
        "./plugins/withSceneLifecycle",
        [
            "expo-splash-screen",
            {
                // The `background` token from src/global.css, in each scheme.
                image: "./assets/images/lexicon-splash.png",
                backgroundColor: "#F6F0EB",
                dark: {
                    image: "./assets/images/lexicon-splash.png",
                    backgroundColor: "#0E1412",
                },
                resizeMode: "contain",
                // Android 12+ masks the splash icon to a 192dp circle, so the
                // wordmark stays narrow enough for its corners to fit there.
                imageWidth: 120,
                ios: { imageWidth: 160 },
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
    extra: {
        ...config.extra,
        eas: {
            projectId: "2bcf0228-85e6-41ed-ab69-b58c862b80d9",
        },
    },
});
