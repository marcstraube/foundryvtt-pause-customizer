# Pause Customizer

[![CI](https://img.shields.io/github/actions/workflow/status/marcstraube/foundryvtt-pause-customizer/ci.yml?label=CI&style=for-the-badge)](https://github.com/marcstraube/foundryvtt-pause-customizer/actions/workflows/ci.yml)
![Downloads (all)](https://img.shields.io/github/downloads/marcstraube/foundryvtt-pause-customizer/total?color=2b82fc&label=Downloads%20%28all%29&style=for-the-badge)
![Downloads (latest release)](https://img.shields.io/github/downloads/marcstraube/foundryvtt-pause-customizer/latest/total?label=Downloads%20%28latest%20release%29&style=for-the-badge)
![Latest Release](https://img.shields.io/github/v/release/marcstraube/foundryvtt-pause-customizer?label=Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)
![Foundry Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmarcstraube%2Ffoundryvtt-pause-customizer%2Fmaster%2Fmodule.json&label=Foundry&query=$.compatibility.minimum&colorB=orange&style=for-the-badge)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fpause-customizer&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=pause-customizer)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/marcstraube)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/marcstraube)

A module to fully customize the FoundryVTT pause overlay — icon, text,
animation, positioning and background.

This module is based on the
[Custom Pause](https://gitlab.com/jestevens210/custom-pause/) module by John
Stevens.

![FVTT Icon](images/custom-pause.gif)

## Features

### Icon

- Custom pause icon (image or video)
- Image width and height
- Opacity
- Vertical offset
- Video support (mp4, webm, ogg) with autoplay and loop

### Text

- Custom pause text
- Font family, size, weight
- Text color
- Text transform (uppercase, lowercase, capitalize)
- Letter spacing
- Text shadow
- Vertical offset

### Animation

- Animation direction (rotate, reverse, alternate, none)
- Animation duration
- Animation timing function

### Background

- Custom CSS background (color, gradient, etc.)
- Background image

### Random Pause Image

Select a folder instead of a single file to randomly pick an image each time the
game is paused. Use the folder button next to the file picker.

### Additional Features

- Dynamic system defaults — automatically detects and displays default values
  from the active game system (e.g. DnD5e)
- Reset to defaults button
- No reload required — changes apply on save without reloading Foundry
- Supports 6 languages: English, German, Spanish, French, Japanese, Portuguese
  (Brazil)

## Video Support

Videos can be used as the pause icon instead of a static image. Supported
formats: mp4, webm, ogg.

> **Note:** The Foundry desktop app (Electron) requires **WebM format** for
> video playback due to codec limitations. MP4 works when accessing Foundry via
> a web browser.

## How to Use

1. Open **Module Settings** for Pause Customizer.
2. Configure the desired settings — changes apply immediately.
3. Use the file picker button to select an image/video, or the folder button to
   select a folder for random images.

For possible CSS values and more information, see:

- [Animation Direction](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction)
- [Animation Duration](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration)
- [Animation Timing](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)
- [Text Shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow)

## Installation

**Method 1:**

- Start Foundry and head to the Add-on Modules tab.
- Click Install Module.
- Search for "Pause Customizer"
- Click the **Install** button when it comes up.

**Method 2:**

- Start Foundry and head to the Add-on Modules tab.
- Click Install Module.
- Paste the following link into the "Manifest URL" field at the bottom:
  <https://github.com/marcstraube/foundryvtt-pause-customizer/releases/latest/download/module.json>
- Click **Install**.

## Contributing

Translations are managed via
[Weblate](https://weblate.foundryvtt-hub.com/engage/pause-customizer/). Feel
free to contribute translations for your language.

## Support

If you enjoy this module, consider supporting its development on
[Ko-fi](https://ko-fi.com/marcstraube) or
[Patreon](https://patreon.com/marcstraube).
