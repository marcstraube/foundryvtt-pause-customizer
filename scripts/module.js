Hooks.on("init", () => {
    game.settings.register("pause-customizer", "chooseFile", {
        name: game.i18n.localize("PAUSE_CUSTOMIZER.SELECT_IMAGE"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.SELECT_IMAGE_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "icons/svg/clockwork.svg",
        filePicker: "image", // This is the important part
        requiresReload: true
    });

    game.settings.register("pause-customizer", "opacity", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.OPACITY"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.OPACITY_HINT"),
        scope: "world",
        config: true,
        type: Number,
        default: 0.5,
        requiresReload: true
	});

    game.settings.register("pause-customizer", "animationDirection", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DIRECTION"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DIRECTION_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "normal",
        choices: {
            "normal": "normal",
            "reverse": "reverse",
            "alternate": "alternate",
            "alternate-reverse": "alternate-reverse"
        },
        requiresReload: true
	});

    game.settings.register("pause-customizer", "animationDuration", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DURATION"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_DURATION_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
	});

    game.settings.register("pause-customizer", "animationTiming", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_TIMING"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_TIMING_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
	});

    game.settings.register("pause-customizer", "pauseText", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
	});

    game.settings.register("pause-customizer", "pauseTextColor", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_COLOR"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_COLOR_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
	});

    game.settings.register("pause-customizer", "pauseTextFontSize", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_FONT_SIZE"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_FONT_SIZE_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
	});

    game.settings.register("pause-customizer", "pauseTextShadow", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_SHADOW"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.PAUSE_TEXT_SHADOW_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
	});
});

Hooks.on("renderPause", (app, html, options) => {
    if (options.paused) {
        const img = html.find("img")[0];
        img.src = game.settings.get("pause-customizer", "chooseFile");

        let style = "--fa-animation-direction: " + game.settings.get("pause-customizer", "animationDirection") + ";";

        if (game.settings.get("pause-customizer", "opacity") !== "") {
            style += "opacity: " + game.settings.get("pause-customizer", "opacity") + ";";
        }

        if (game.settings.get("pause-customizer", "animationDuration") !== "") {
            style += "--fa-animation-duration: " + game.settings.get("pause-customizer", "animationDuration") + ";";
        }

        if (game.settings.get("pause-customizer", "animationTiming") !== "") {
            style += "--fa-animation-timing: " + game.settings.get("pause-customizer", "animationTiming") + ";";
        }

        img.style = style;

        const caption = html.find("figcaption")[0];

        if (game.settings.get("pause-customizer", "pauseText") !== "") {
            caption.textContent = game.settings.get("pause-customizer", "pauseText");
        }

        style = "";

        if (game.settings.get("pause-customizer", "pauseTextColor") !== "") {
            style += "color:" + game.settings.get("pause-customizer", "pauseTextColor") + ";";
        }

        if (game.settings.get("pause-customizer", "pauseTextFontSize") !== "") {
            style += "font-size:" + game.settings.get("pause-customizer", "pauseTextFontSize") + ";";
        }

        if (game.settings.get("pause-customizer", "pauseTextShadow") !== "") {
            style += "text-shadow:" + game.settings.get("pause-customizer", "pauseTextShadow") + ";";
        }

        caption.style = style;
    }
});

Hooks.once('libChangelogsReady', function () {
    libChangelogs.register(
        "pause-customizer",
        "<ul>" +
        "<li>Add French translation.</li>" +
        "<li>Allow customization of image opacity, text color, font-size and shadow.</li>" +
        "</ul>",
        "minor"
    );
});
