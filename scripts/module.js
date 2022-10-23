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
        default: "5s",
        requiresReload: true
	});

    game.settings.register("pause-customizer", "animationTiming", {
		name: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_TIMING"),
        hint: game.i18n.localize("PAUSE_CUSTOMIZER.ANIMATION_TIMING_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "linear",
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
});

Hooks.on("renderPause", (app, html, options) => {
    if (options.paused) {
        let img = html.find("img")[0];
        img.src = game.settings.get("pause-customizer", "chooseFile");

        let style = "--fa-animation-direction: " + game.settings.get("pause-customizer", "animationDirection") + ";";
        style += "--fa-animation-duration: " + game.settings.get("pause-customizer", "animationDuration") + ";";
        style += "--fa-animation-timing: " + game.settings.get("pause-customizer", "animationTiming") + ";";
        img.style = style;

        let caption = html.find("figcaption")[0];
        let pauseText = game.settings.get("pause-customizer", "pauseText");

        if (pauseText !== "") {
            caption.textContent = pauseText;
        }
    }
});

Hooks.once('libChangelogsReady', function () {
    libChangelogs.register(
        "pause-customizer",
        "<ul>" +
        "<li>Initial release of <strong>Pause Customizer</strong> module.</li>" +
        "</ul>",
        "major"
    );
});
