Hooks.on("init", () => {
game.settings.register("custom-pause", "chooseFile", {
  name: "Select Image",
  hint: "Select an image for your pause icon. Reload when finished.",
  scope: "world",
  config: true,
  type: String,
  filePicker: true // This is the important part
  })
});
Hooks.on("renderPause", (app, html, options) => {
    if (options.paused) {
      html.find("img")[0].src = (game.settings.get("custom-pause", "chooseFile"))
    }
  });
