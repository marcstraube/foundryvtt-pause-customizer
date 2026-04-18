import { MODULE_ID, SETTINGS, DEFAULTS, I18N_KEYS } from './constants.js';

/**
 * Minimal typed interface for Foundry's ClientSettings.
 */
interface FoundrySettings {
  register(module: string, key: string, data: Record<string, unknown>): void;
  get(module: string, key: string): unknown;
}

/**
 * Context passed to GamePause render hook in v14.
 */
interface GamePauseContext {
  cssClass: string;
  icon: string;
  text: string;
  spin: boolean;
}

/**
 * Cached system defaults captured before our module applies any overrides.
 * Populated on the first renderApplicationV2 call for the pause element
 * (other modules/systems run their renderGamePause hooks first).
 */
const systemDefaults: { icon?: string; text?: string; cssSnapshot?: Record<string, string> } = {};

/** Cached list of image files when chooseFile points to a directory. */
let directoryImages: string[] = [];

/**
 * Load image files from a directory for random pause image selection.
 * If the path is a file (has image extension) or empty, the cache is cleared.
 */
async function loadDirectoryImages(path: string): Promise<void> {
  directoryImages = [];
  if (!path || /\.(jpg|jpeg|png|gif|svg|webp|avif|bmp|tiff?)$/i.test(path)) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (FilePicker as any).browse('data', path);
    directoryImages = (result.files as string[]).filter((f: string) =>
      /\.(jpg|jpeg|png|gif|svg|webp|avif|bmp|tiff?)$/i.test(f)
    );
  } catch {
    directoryImages = [];
  }
}

// Register all settings that don't depend on runtime data
Hooks.once('init', () => {
  const settings = game.settings as unknown as FoundrySettings;
  const defaultLabel = game.i18n?.localize(I18N_KEYS.DEFAULT) ?? 'Default';
  const noneLabel = game.i18n?.localize(I18N_KEYS.NONE) ?? 'None';

  // --- Image Settings ---

  settings.register(MODULE_ID, SETTINGS.CHOOSE_FILE, {
    name: game.i18n?.localize(I18N_KEYS.SELECT_IMAGE) ?? 'Select image',
    hint: game.i18n?.localize(I18N_KEYS.SELECT_IMAGE_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    filePicker: 'image',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.IMAGE_WIDTH, {
    name: game.i18n?.localize(I18N_KEYS.IMAGE_WIDTH) ?? 'Image width',
    hint: game.i18n?.localize(I18N_KEYS.IMAGE_WIDTH_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.IMAGE_HEIGHT, {
    name: game.i18n?.localize(I18N_KEYS.IMAGE_HEIGHT) ?? 'Image height',
    hint: game.i18n?.localize(I18N_KEYS.IMAGE_HEIGHT_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.OPACITY, {
    name: game.i18n?.localize(I18N_KEYS.OPACITY) ?? 'Opacity',
    hint: game.i18n?.localize(I18N_KEYS.OPACITY_HINT) ?? '',
    scope: 'world',
    config: true,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 1,
    requiresReload: false,
  });

  // --- Text Settings ---

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT) ?? 'Pause text',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_COLOR, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_COLOR) ?? 'Pause text color',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_COLOR_HINT) ?? '',
    scope: 'world',
    config: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: new (foundry.data.fields as any).ColorField(),
    default: DEFAULTS[SETTINGS.PAUSE_TEXT_COLOR],
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_SIZE, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_FONT_SIZE) ?? 'Pause text font size',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_FONT_SIZE_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_WEIGHT, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_FONT_WEIGHT) ?? 'Font weight',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_FONT_WEIGHT_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: 'default',
    choices: {
      default: defaultLabel,
      normal: 'normal',
      bold: 'bold',
      lighter: 'lighter',
      bolder: 'bolder',
      '100': '100',
      '200': '200',
      '300': '300',
      '400': '400',
      '500': '500',
      '600': '600',
      '700': '700',
      '800': '800',
      '900': '900',
    },
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_TRANSFORM, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_TRANSFORM) ?? 'Text transform',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_TRANSFORM_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: 'default',
    choices: {
      default: defaultLabel,
      none: noneLabel,
      uppercase: 'UPPERCASE',
      lowercase: 'lowercase',
      capitalize: 'Capitalize',
    },
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_LETTER_SPACING, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_LETTER_SPACING) ?? 'Letter spacing',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_LETTER_SPACING_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_SHADOW, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_SHADOW) ?? 'Pause text shadow',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_SHADOW_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  // --- Position Settings ---

  settings.register(MODULE_ID, SETTINGS.IMAGE_MARGIN_TOP, {
    name: game.i18n?.localize(I18N_KEYS.IMAGE_MARGIN_TOP) ?? 'Icon vertical offset',
    hint: game.i18n?.localize(I18N_KEYS.IMAGE_MARGIN_TOP_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_MARGIN_TOP, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_MARGIN_TOP) ?? 'Text vertical offset',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_MARGIN_TOP_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  // --- Animation Settings ---

  settings.register(MODULE_ID, SETTINGS.ANIMATION_DIRECTION, {
    name: game.i18n?.localize(I18N_KEYS.ANIMATION_DIRECTION) ?? 'Animation direction',
    hint: game.i18n?.localize(I18N_KEYS.ANIMATION_DIRECTION_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: 'default',
    choices: {
      default: defaultLabel,
      none: noneLabel,
      normal: game.i18n?.localize(I18N_KEYS.DIRECTION_ROTATE) ?? 'Rotate',
      reverse: game.i18n?.localize(I18N_KEYS.DIRECTION_ROTATE_REVERSE) ?? 'Rotate reverse',
      alternate: game.i18n?.localize(I18N_KEYS.DIRECTION_ALTERNATE) ?? 'Alternate',
      'alternate-reverse':
        game.i18n?.localize(I18N_KEYS.DIRECTION_ALTERNATE_REVERSE) ?? 'Alternate reverse',
    },
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.ANIMATION_DURATION, {
    name: game.i18n?.localize(I18N_KEYS.ANIMATION_DURATION) ?? 'Animation duration',
    hint: game.i18n?.localize(I18N_KEYS.ANIMATION_DURATION_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.ANIMATION_TIMING, {
    name: game.i18n?.localize(I18N_KEYS.ANIMATION_TIMING) ?? 'Animation timing',
    hint: game.i18n?.localize(I18N_KEYS.ANIMATION_TIMING_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: 'default',
    choices: {
      default: defaultLabel,
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
    },
    requiresReload: false,
  });

  // --- Background ---

  settings.register(MODULE_ID, SETTINGS.PAUSE_BACKGROUND, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_BACKGROUND) ?? 'Background',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_BACKGROUND_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_BACKGROUND_IMAGE, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_BACKGROUND_IMAGE) ?? 'Background image',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_BACKGROUND_IMAGE_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    filePicker: 'image',
    requiresReload: false,
  });
});

// Register font family setting in setup hook (fonts are available at this point)
Hooks.once('setup', () => {
  const settings = game.settings as unknown as FoundrySettings;

  const fontKeys = [
    ...Object.keys(CONFIG.fontDefinitions),
    ...Object.keys((settings.get('core', 'fonts') as Record<string, unknown>) ?? {}),
  ].sort();

  const fontChoices: Record<string, string> = {
    default: game.i18n?.localize(I18N_KEYS.DEFAULT) ?? 'Default',
  };
  for (const key of fontKeys) {
    fontChoices[key] = key;
  }

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_FAMILY, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_FONT_FAMILY) ?? 'Pause text font family',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_FONT_FAMILY_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    choices: fontChoices,
    default: 'default',
    requiresReload: false,
  });
});

// Re-render the pause overlay whenever our settings change
Hooks.on('updateSetting', (setting: { key?: string }) => {
  if (setting.key?.startsWith(`${MODULE_ID}.`)) {
    // Refresh directory image cache when the icon path changes
    if (setting.key === `${MODULE_ID}.${SETTINGS.CHOOSE_FILE}`) {
      const settings = game.settings as unknown as FoundrySettings;
      const pauseImage = settings.get(MODULE_ID, SETTINGS.CHOOSE_FILE) as string;
      loadDirectoryImages(pauseImage);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pause = (ui as any).pause as { render?: (opts?: object) => void } | undefined;
    pause?.render?.({ force: true });
  }
});

// Load directory image cache on startup
Hooks.once('ready', async () => {
  const settings = game.settings as unknown as FoundrySettings;
  const pauseImage = settings.get(MODULE_ID, SETTINGS.CHOOSE_FILE) as string;
  if (pauseImage) {
    await loadDirectoryImages(pauseImage);
    if (directoryImages.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pause = (ui as any).pause as { render?: (opts?: object) => void } | undefined;
      pause?.render?.({ force: true });
    }
  }
});

/**
 * Read the system/Foundry pause overlay defaults.
 *
 * Uses the systemDefaults cache (populated on first renderApplicationV2 before our
 * overrides are applied). This captures system-specific values like DnD5e's
 * custom icon. Falls back to DEFAULTS if the cache is not yet populated.
 */
function readFoundryPauseDefaults(): Record<string, string> {
  const result: Record<string, string> = { ...DEFAULTS };

  // Icon + text from cache (captured before our overrides in renderApplicationV2)
  if (systemDefaults.icon) result[SETTINGS.CHOOSE_FILE] = systemDefaults.icon;
  if (systemDefaults.text) result[SETTINGS.PAUSE_TEXT] = systemDefaults.text;

  // CSS values from cache
  if (systemDefaults.cssSnapshot) {
    const css = systemDefaults.cssSnapshot;
    if (css.color) result[SETTINGS.PAUSE_TEXT_COLOR] = css.color;
    if (css.fontSize) result[SETTINGS.PAUSE_TEXT_FONT_SIZE] = css.fontSize;
    if (css.letterSpacing) result[SETTINGS.PAUSE_TEXT_LETTER_SPACING] = css.letterSpacing;
    if (css.textShadow !== undefined) result[SETTINGS.PAUSE_TEXT_SHADOW] = css.textShadow;
    if (css.imageWidth) result[SETTINGS.IMAGE_WIDTH] = css.imageWidth;
    if (css.imageHeight) result[SETTINGS.IMAGE_HEIGHT] = css.imageHeight;
    if (css.opacity) result[SETTINGS.OPACITY] = css.opacity;
    if (css.background) result[SETTINGS.PAUSE_BACKGROUND] = css.background;

    // Animation values only relevant when the system uses rotation
    if (css.hasRotation === 'false') {
      result[SETTINGS.ANIMATION_DURATION] = '';
      result[SETTINGS.ANIMATION_TIMING] = '';
    }
  }

  // Font family: always reset to "default" (the select option), not the resolved CSS value
  result[SETTINGS.PAUSE_TEXT_FONT_FAMILY] = 'default';

  // Fallback for text if cache not populated yet
  if (!result[SETTINGS.PAUSE_TEXT]) {
    result[SETTINGS.PAUSE_TEXT] = game.i18n?.localize('GAME.Paused') ?? '';
  }

  return result;
}

/**
 * Convert an rgb(r, g, b) string to a hex color string.
 */
function rgbToHex(rgb: string | undefined | null): string | null {
  if (!rgb) return null;
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb.startsWith('#') ? rgb : null;
  const [, r, g, b] = match;
  return '#' + [r, g, b].map((v) => Number(v).toString(16).padStart(2, '0')).join('');
}

// Add "Reset to Defaults" button and placeholders to the settings config
Hooks.on('renderSettingsConfig', (_app: unknown, html: HTMLElement) => {
  if (!html) return;

  // Find all settings for this module and get the last one
  const allModuleInputs = html.querySelectorAll(`[name^="${MODULE_ID}."]`);
  if (allModuleInputs.length === 0) return;

  const lastInput = allModuleInputs[allModuleInputs.length - 1];
  const lastFormGroup = lastInput?.closest('.form-group');
  if (!lastFormGroup) return;

  // Read system/Foundry defaults (from cache populated during first render)
  const foundryDefaults = readFoundryPauseDefaults();
  const defaultLabel = game.i18n?.localize(I18N_KEYS.DEFAULT) ?? 'Default';

  // Update "Default" option labels in dropdowns to show the actual system value
  const hasRotation = systemDefaults.cssSnapshot?.hasRotation !== 'false';
  const noneLabel = game.i18n?.localize(I18N_KEYS.NONE) ?? 'None';

  const dropdownDefaults: Record<string, string | undefined> = {
    [SETTINGS.ANIMATION_DIRECTION]: hasRotation
      ? systemDefaults.cssSnapshot?.animationDirection
      : undefined,
    [SETTINGS.ANIMATION_TIMING]: hasRotation
      ? systemDefaults.cssSnapshot?.animationTimingFunction
      : undefined,
    [SETTINGS.PAUSE_TEXT_FONT_WEIGHT]: systemDefaults.cssSnapshot?.fontWeight,
    [SETTINGS.PAUSE_TEXT_TRANSFORM]: systemDefaults.cssSnapshot?.textTransform,
  };

  for (const [key, systemValue] of Object.entries(dropdownDefaults)) {
    const select = html.querySelector(`[name="${MODULE_ID}.${key}"]`) as HTMLSelectElement | null;
    const defaultOption = select?.querySelector(
      'option[value="default"]'
    ) as HTMLOptionElement | null;
    if (!defaultOption) continue;
    if (systemValue && systemValue !== 'default') {
      // Use the localized label from the matching option if available
      const matchingOption = select?.querySelector(
        `option[value="${systemValue}"]`
      ) as HTMLOptionElement | null;
      const displayValue = matchingOption?.textContent ?? systemValue;
      defaultOption.textContent = `${defaultLabel} (${displayValue})`;
    }
  }

  // Animation direction: if system has no rotation, show "Default (none)"
  if (!hasRotation) {
    const dirSelect = html.querySelector(
      `[name="${MODULE_ID}.${SETTINGS.ANIMATION_DIRECTION}"]`
    ) as HTMLSelectElement | null;
    const dirDefault = dirSelect?.querySelector(
      'option[value="default"]'
    ) as HTMLOptionElement | null;
    if (dirDefault) {
      dirDefault.textContent = `${defaultLabel} (${noneLabel})`;
    }
  }

  // Font family: show resolved font name in the "Default" option
  if (systemDefaults.cssSnapshot?.fontFamily) {
    const fontSelect = html.querySelector(
      `[name="${MODULE_ID}.${SETTINGS.PAUSE_TEXT_FONT_FAMILY}"]`
    ) as HTMLSelectElement | null;
    const fontDefault = fontSelect?.querySelector(
      'option[value="default"]'
    ) as HTMLOptionElement | null;
    if (fontDefault) {
      // Show first font from the font-family stack (strip quotes)
      const primaryFont = systemDefaults.cssSnapshot.fontFamily
        .split(',')[0]
        ?.trim()
        .replace(/['"]/g, '');
      if (primaryFont) {
        fontDefault.textContent = `${defaultLabel} (${primaryFont})`;
      }
    }
  }

  // Set placeholders on text inputs to show system/Foundry default values
  const placeholderSettings = [
    SETTINGS.PAUSE_TEXT,
    SETTINGS.IMAGE_WIDTH,
    SETTINGS.IMAGE_HEIGHT,
    SETTINGS.PAUSE_TEXT_FONT_SIZE,
    SETTINGS.PAUSE_TEXT_LETTER_SPACING,
    SETTINGS.PAUSE_TEXT_SHADOW,
    SETTINGS.IMAGE_MARGIN_TOP,
    SETTINGS.PAUSE_TEXT_MARGIN_TOP,
    SETTINGS.ANIMATION_DURATION,
    SETTINGS.PAUSE_BACKGROUND,
  ];

  for (const key of placeholderSettings) {
    const input = html.querySelector(`[name="${MODULE_ID}.${key}"]`) as HTMLInputElement | null;
    const defaultVal = foundryDefaults[key];
    if (input && defaultVal) {
      input.placeholder = defaultVal;
    }
  }

  // Set placeholder on file picker inputs (custom elements with inner <input>)
  const filePickerSettings = [SETTINGS.CHOOSE_FILE, SETTINGS.PAUSE_BACKGROUND_IMAGE];
  for (const key of filePickerSettings) {
    const defaultVal = foundryDefaults[key];
    if (!defaultVal) continue;
    const picker = html.querySelector(`[name="${MODULE_ID}.${key}"]`) as HTMLElement | null;
    const innerInput = picker?.querySelector('input[type="text"]') as HTMLInputElement | null;
    if (innerInput) innerInput.placeholder = defaultVal;
  }

  // Add folder browse button next to the chooseFile file picker
  const chooseFilePicker = html.querySelector(
    `[name="${MODULE_ID}.${SETTINGS.CHOOSE_FILE}"]`
  ) as HTMLElement | null;
  if (chooseFilePicker) {
    const fileButton = chooseFilePicker.querySelector('button') as HTMLButtonElement | null;
    if (fileButton) {
      const folderButton = document.createElement('button');
      folderButton.type = 'button';
      folderButton.innerHTML = '<i class="fa-solid fa-folder-open"></i>';
      fileButton.setAttribute(
        'data-tooltip',
        game.i18n?.localize(I18N_KEYS.BROWSE_FILES) ?? 'Browse files'
      );
      folderButton.setAttribute(
        'data-tooltip',
        game.i18n?.localize(I18N_KEYS.BROWSE_FOLDER) ?? 'Browse folder'
      );
      folderButton.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        const innerInput = chooseFilePicker.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (FilePicker as any)({
          type: 'folder',
          callback: (path: string) => {
            if (innerInput) {
              innerInput.value = path;
              innerInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
          },
        }).browse();
      });
      fileButton.after(folderButton);
    }
  }

  // Replace background input with textarea for longer CSS values
  const bgInput = html.querySelector(
    `[name="${MODULE_ID}.${SETTINGS.PAUSE_BACKGROUND}"]`
  ) as HTMLInputElement | null;
  if (bgInput) {
    const textarea = document.createElement('textarea');
    textarea.name = bgInput.name;
    textarea.value = bgInput.value;
    textarea.placeholder = bgInput.placeholder;
    textarea.rows = 2;
    bgInput.replaceWith(textarea);
  }

  // Set placeholder on color picker text input
  const colorDefault = foundryDefaults[SETTINGS.PAUSE_TEXT_COLOR];
  if (colorDefault) {
    const colorPicker = html.querySelector(
      `[name="${MODULE_ID}.${SETTINGS.PAUSE_TEXT_COLOR}"]`
    ) as HTMLElement | null;
    const colorText = colorPicker?.querySelector('input[type="text"]') as HTMLInputElement | null;
    if (colorText) colorText.placeholder = colorDefault;
  }

  // Build reset button
  const wrapper = document.createElement('div');
  wrapper.className = 'form-group';
  wrapper.style.textAlign = 'right';

  const button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = `<i class="fa fa-undo"></i> ${game.i18n?.localize(I18N_KEYS.RESET_DEFAULTS) ?? 'Reset to Defaults'}`;

  button.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();

    // Reset text inputs to empty (placeholders will show system defaults)
    const stringKeys = [
      SETTINGS.CHOOSE_FILE,
      SETTINGS.IMAGE_WIDTH,
      SETTINGS.IMAGE_HEIGHT,
      SETTINGS.PAUSE_TEXT,
      SETTINGS.PAUSE_TEXT_FONT_SIZE,
      SETTINGS.PAUSE_TEXT_LETTER_SPACING,
      SETTINGS.PAUSE_TEXT_SHADOW,
      SETTINGS.IMAGE_MARGIN_TOP,
      SETTINGS.PAUSE_TEXT_MARGIN_TOP,
      SETTINGS.ANIMATION_DURATION,
      SETTINGS.PAUSE_BACKGROUND,
      SETTINGS.PAUSE_BACKGROUND_IMAGE,
    ];

    for (const key of stringKeys) {
      const input = html.querySelector(`[name="${MODULE_ID}.${key}"]`) as HTMLInputElement | null;
      if (input) input.value = '';
    }

    // Reset select inputs to "default" (= don't override)
    const selectKeys = [
      SETTINGS.ANIMATION_DIRECTION,
      SETTINGS.ANIMATION_TIMING,
      SETTINGS.PAUSE_TEXT_FONT_FAMILY,
      SETTINGS.PAUSE_TEXT_FONT_WEIGHT,
      SETTINGS.PAUSE_TEXT_TRANSFORM,
    ];
    for (const key of selectKeys) {
      const select = html.querySelector(`[name="${MODULE_ID}.${key}"]`) as HTMLSelectElement | null;
      if (select) select.value = 'default';
    }

    // Reset range input (opacity) to system default
    const defaults = readFoundryPauseDefaults();
    const opacityInput = html.querySelector(
      `[name="${MODULE_ID}.${SETTINGS.OPACITY}"]`
    ) as HTMLInputElement | null;
    if (opacityInput) {
      opacityInput.value = defaults[SETTINGS.OPACITY] ?? '1';
      opacityInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Reset color picker to system default color
    const resetColor =
      defaults[SETTINGS.PAUSE_TEXT_COLOR] ?? DEFAULTS[SETTINGS.PAUSE_TEXT_COLOR] ?? '#ada7b8';
    const colorPicker = html.querySelector(
      `[name="${MODULE_ID}.${SETTINGS.PAUSE_TEXT_COLOR}"]`
    ) as HTMLElement | null;
    if (colorPicker) {
      const textInput = colorPicker.querySelector('input[type="text"]') as HTMLInputElement | null;
      const colorInput = colorPicker.querySelector(
        'input[type="color"]'
      ) as HTMLInputElement | null;
      if (textInput) textInput.value = resetColor;
      if (colorInput) colorInput.value = resetColor;
    }

    ui.notifications?.info(
      game.i18n?.localize(I18N_KEYS.RESET_DEFAULTS_DONE) ??
        'Pause Customizer settings reset to defaults.'
    );
  });

  wrapper.appendChild(button);
  lastFormGroup.after(wrapper);
});

// Apply pause customizations via renderApplicationV2 instead of renderGamePause.
// This is intentional: systems like DnD5e check Hooks.events.renderGamePause.length
// and skip their styling if other modules hook into renderGamePause. By using the
// parent class hook (renderApplicationV2), we run AFTER system hooks have applied
// their defaults (e.g. DnD5e's ampersand icon), without blocking them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Hooks.on as (hook: string, fn: (...args: any[]) => void) => number)(
  'renderApplicationV2',
  (_app: unknown, element: HTMLElement, context: GamePauseContext, _options: unknown) => {
    // Only handle the GamePause application
    if (element.id !== 'pause') return;
    if (!context.cssClass?.includes('paused')) return;

    const settings = game.settings as unknown as FoundrySettings;
    const img = element.querySelector('img') as HTMLElement | null;
    const caption = element.querySelector('figcaption') as HTMLElement | null;
    if (!img || !caption) return;

    // Cache system/Foundry defaults before we apply any overrides.
    // System hooks (e.g. DnD5e on renderGamePause) have already run at this point.
    if (!systemDefaults.icon) {
      systemDefaults.icon = img.getAttribute('src') ?? undefined;
      systemDefaults.text = caption.textContent?.trim() ?? undefined;
      const cs = getComputedStyle(caption);
      const is = getComputedStyle(img);
      systemDefaults.cssSnapshot = {
        color: rgbToHex(cs.color) ?? '',
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        textTransform: cs.textTransform,
        letterSpacing: cs.letterSpacing,
        textShadow: cs.textShadow === 'none' ? '' : cs.textShadow,
        imageWidth: is.width,
        imageHeight: is.height,
        opacity: is.opacity,
        background: getComputedStyle(element).background,
        hasRotation: img.classList.contains('fa-spin') ? 'true' : 'false',
        animationDirection: is.animationDirection,
        animationTimingFunction: is.animationTimingFunction,
      };
    }

    // Clear all inline styles we may have applied previously.
    // This ensures that clearing a setting actually removes the override.
    element.style.removeProperty('background');
    element.style.removeProperty('background-image');
    img.style.removeProperty('width');
    img.style.removeProperty('height');
    img.style.removeProperty('opacity');
    img.style.removeProperty('--fa-animation-direction');
    img.style.removeProperty('--fa-animation-duration');
    img.style.removeProperty('--fa-animation-timing');
    caption.style.removeProperty('font-family');
    caption.style.removeProperty('color');
    caption.style.removeProperty('font-size');
    caption.style.removeProperty('font-weight');
    caption.style.removeProperty('text-transform');
    caption.style.removeProperty('letter-spacing');
    caption.style.removeProperty('text-shadow');
    img.style.removeProperty('margin-top');
    caption.style.removeProperty('margin-top');

    const pauseImage = settings.get(MODULE_ID, SETTINGS.CHOOSE_FILE) as string;
    const imageWidth = settings.get(MODULE_ID, SETTINGS.IMAGE_WIDTH) as string;
    const imageHeight = settings.get(MODULE_ID, SETTINGS.IMAGE_HEIGHT) as string;
    const opacity = settings.get(MODULE_ID, SETTINGS.OPACITY) as number;
    const pauseText = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT) as string;
    const pauseTextFontFamily = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_FAMILY) as string;
    const pauseTextColor = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_COLOR) as string;
    const pauseTextFontSize = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_SIZE) as string;
    const pauseTextFontWeight = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_WEIGHT) as string;
    const pauseTextTransform = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_TRANSFORM) as string;
    const pauseTextLetterSpacing = settings.get(
      MODULE_ID,
      SETTINGS.PAUSE_TEXT_LETTER_SPACING
    ) as string;
    const pauseTextShadow = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_SHADOW) as string;
    const animationDirection = settings.get(MODULE_ID, SETTINGS.ANIMATION_DIRECTION) as string;
    const animationDuration = settings.get(MODULE_ID, SETTINGS.ANIMATION_DURATION) as string;
    const animationTiming = settings.get(MODULE_ID, SETTINGS.ANIMATION_TIMING) as string;
    const imageMarginTop = settings.get(MODULE_ID, SETTINGS.IMAGE_MARGIN_TOP) as string;
    const pauseTextMarginTop = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_MARGIN_TOP) as string;
    const pauseBackground = settings.get(MODULE_ID, SETTINGS.PAUSE_BACKGROUND) as string;
    const pauseBackgroundImage = settings.get(MODULE_ID, SETTINGS.PAUSE_BACKGROUND_IMAGE) as string;

    // --- Image ---

    if (directoryImages.length > 0) {
      const randomImage = directoryImages[Math.floor(Math.random() * directoryImages.length)]!;
      img.setAttribute('src', randomImage);
    } else if (pauseImage) {
      img.setAttribute('src', pauseImage);
    }

    if (imageWidth) {
      img.style.width = imageWidth;
    }

    if (imageHeight) {
      img.style.height = imageHeight;
    }

    if (opacity !== undefined && opacity !== 1) {
      img.style.opacity = String(opacity);
    }

    // --- Animation ---

    if (animationDirection === 'none') {
      img.classList.remove('fa-spin');
    } else if (animationDirection !== 'default') {
      img.classList.add('fa-spin');
      img.style.setProperty('--fa-animation-direction', animationDirection);
    }

    if (animationDuration) {
      img.style.setProperty('--fa-animation-duration', animationDuration);
    }

    if (animationTiming && animationTiming !== 'default') {
      img.style.setProperty('--fa-animation-timing', animationTiming);
    }

    // --- Background ---

    if (pauseBackground) {
      element.style.background = pauseBackground;
    }

    if (pauseBackgroundImage) {
      element.style.backgroundImage = `url(../${pauseBackgroundImage})`;
    }

    // --- Text ---

    if (pauseText) {
      caption.textContent = pauseText;
    }

    if (pauseTextFontFamily && pauseTextFontFamily !== 'default') {
      caption.style.fontFamily = pauseTextFontFamily;
    }

    if (pauseTextColor) {
      caption.style.color = pauseTextColor;
    }

    if (pauseTextFontSize) {
      caption.style.fontSize = pauseTextFontSize;
    }

    if (pauseTextFontWeight && pauseTextFontWeight !== 'default') {
      caption.style.fontWeight = pauseTextFontWeight;
    }

    if (pauseTextTransform && pauseTextTransform !== 'default') {
      caption.style.textTransform = pauseTextTransform;
    }

    if (pauseTextLetterSpacing) {
      caption.style.letterSpacing = pauseTextLetterSpacing;
    }

    if (pauseTextShadow) {
      caption.style.textShadow = pauseTextShadow;
    }

    // --- Position ---

    if (imageMarginTop) {
      img.style.marginTop = imageMarginTop;
    }

    if (pauseTextMarginTop) {
      caption.style.marginTop = pauseTextMarginTop;
    }
  }
);
