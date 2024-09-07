Hooks.on("setup", () => {
    game.settings.register("pause-customizer", "chooseFile", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.SELECT_IMAGE"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.SELECT_IMAGE_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        filePicker: "image", // This is the important part
        requiresReload: false
    });

    game.settings.register("pause-customizer", "opacity", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.OPACITY"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.OPACITY_HINT"),
        scope: "world",
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 1,
            step: 0.05
        },
        default: 0.75,
        requiresReload: false
	});

    game.settings.register("pause-customizer", "pauseText", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: false
	});

    let fonts = Object.keys(CONFIG.fontDefinitions).concat(
        Object.keys(game.settings.get("core", "fonts"))
    ).sort();

    game.settings.register("pause-customizer", "pauseTextFontFamily", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_FONT_FAMILY"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_FONT_FAMILY_HINT"),
        scope: "world",
        config: true,
        type: String,
        choices: fonts,
        default: fonts.indexOf(CONFIG.defaultFontFamily),
        requiresReload: false
	});

    new window.Ardittristan.ColorSetting("pause-customizer", "pauseTextColor", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_COLOR"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_COLOR_HINT"),
        label: "Color Picker",         // The text label used in the button
        restricted: true,
        defaultColor: "#ffffffff",
        scope: "world"
    })

    game.settings.register("pause-customizer", "pauseTextFontSize", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_FONT_SIZE"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_FONT_SIZE_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: false
	});

    game.settings.register("pause-customizer", "pauseTextShadow", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_SHADOW"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_SHADOW_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: false
	});

    game.settings.register("pause-customizer", "animationDirection", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DIRECTION"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DIRECTION_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "default",
        choices: {
            "default": game.i18n.localize("PAUSE_CUSTOMIZER.DEFAULT"),
            "none": "none",
            "normal": "normal",
            "reverse": "reverse",
            "alternate": "alternate",
            "alternate-reverse": "alternate-reverse"
        },
        requiresReload: false
    });

    game.settings.register("pause-customizer", "animationDuration", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DURATION"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DURATION_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: false
    });

    game.settings.register("pause-customizer", "animationTiming", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_TIMING"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_TIMING_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: false
    });

    game.settings.register("pause-customizer", "pauseBackground", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_BACKGROUND"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_BACKGROUND_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        filePicker: "image", // This is the important part
        requiresReload: false
    });
});

Hooks.once('ready', () => {
    try{window.Ardittristan.ColorSetting.tester} catch {
        ui.notifications.notify('Please make sure you have the "lib - ColorSettings" module installed and enabled.', "error");
    }
});

Hooks.on("renderPause", (app, html, options) => {
    if (options.paused) {
        const wrapper = $("#pause");
        const img = $("#pause > img");
        const caption = $("#pause > figcaption");
        let pauseBackground = game.settings.get("pause-customizer", "pauseBackground");
        let pauseImage = game.settings.get("pause-customizer", "chooseFile");
        let animationDirection = game.settings.get("pause-customizer", "animationDirection");
        let opacity = game.settings.get("pause-customizer", "opacity");
        let animationDuration = game.settings.get("pause-customizer", "animationDuration");
        let animationTiming = game.settings.get("pause-customizer", "animationTiming");
        let pauseText = game.settings.get("pause-customizer", "pauseText");
        let pauseTextFontFamily = game.settings.get("pause-customizer", "pauseTextFontFamily");
        let pauseTextColor = game.settings.get("pause-customizer", "pauseTextColor");
        let pauseTextFontSize = game.settings.get("pause-customizer", "pauseTextFontSize");
        let pauseTextShadow = game.settings.get("pause-customizer", "pauseTextShadow");

        // Compatibility fix for DnD5e
        if (
            game.data.system.id === "dnd5e" &&
            foundry.utils.isNewerVersion(game.data.system.version, "2.4.1") &&
            animationDirection !== "default" &&
            animationDirection !== "none"
        ) {
            wrapper.removeClass("dnd5e2");
            img.addClass("fa-spin");
        }

        if (animationDirection === "none") {
            img.removeClass("fa-spin");
        }

        if (
            pauseBackground !== "" &&
            animationDirection !== "none"
        ) {
            if (pauseBackground !== "none") {
                pauseBackground = "url(../" + pauseBackground + ")";
            }
            wrapper.css("background-image", pauseBackground);
        }

        if (pauseImage !== "") {
            img.attr("src", pauseImage);

            // Compatiblity fix for Twilight: 2000 (4th Edition)
            if (game.data.system.id === "t2k4e") {
                img.css("content", "unset");
            }
        }

        if (opacity !== "") {
            img.css("opacity", opacity)
        }

        if (animationDirection !== "Default") {
            img.css("--fa-animation-direction", animationDirection)
        }

        if (animationDuration !== "") {
            img.css("--fa-animation-duration", animationDuration)
        }

        if (animationTiming !== "") {
            img.css("--fa-animation-timing", animationTiming)
        }

        if (pauseText !== "") {
            caption.text(pauseText);
        }

        if (pauseTextFontFamily !== "") {
            caption.css("font-family", pauseTextFontFamily);
        }

        if (pauseTextColor !== "") {
            caption.css("color", pauseTextColor);
        }

        if (pauseTextFontSize !== "") {
            caption.css("font-size", pauseTextFontSize);
        }

        if (pauseTextShadow !== "") {
            caption.css("text-shadow", pauseTextShadow);
        }
    }
});
