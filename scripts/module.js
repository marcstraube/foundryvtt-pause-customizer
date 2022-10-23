Hooks.on("init", () => {
    game.settings.register("custom-pause", "chooseFile", {
        name: game.i18n.localize("CUSTOM_PAUSE.SELECT_IMAGE"),
        hint: game.i18n.localize("CUSTOM_PAUSE.SELECT_IMAGE_HINT"),
        scope: "world",
        config: true,
        type: String,
        default: "icons/svg/clockwork.svg",
        filePicker: true // This is the important part
    });
});

Hooks.on("renderPause", (app, html, options) => {
    if (options.paused) {
      html.find("img")[0].src = (game.settings.get("custom-pause", "chooseFile"))
    }
});

Hooks.once('libChangelogsReady', function () {
    libChangelogs.register(
        "custom-pause",
        "<ul>" +
        "<li>Update module compatibility to FoundryVTT version 10.</li>" +
        "<li>Add German translation.</li>" +
        "<li>Add support for <a href='https://github.com/theripper93/libChangelogs' target='_blank' style='font-style: bold;'>Changelogs & Conflicts</a> module.</li>" +
        "<li>Add support for <a href='https://github.com/League-of-Foundry-Developers/bug-reporter' target='_blank' style='font-style: bold;'>Bug Reporter</a> module.</li>" +
        "</ul>",
        "minor"
    );
});
