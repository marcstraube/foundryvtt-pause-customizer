import { MODULE_ID, SETTINGS, I18N_KEYS } from './constants.js';

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

// Register all settings that don't depend on runtime data
Hooks.once('init', () => {
  const settings = game.settings as unknown as FoundrySettings;

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

  settings.register(MODULE_ID, SETTINGS.OPACITY, {
    name: game.i18n?.localize(I18N_KEYS.OPACITY) ?? 'Opacity',
    hint: game.i18n?.localize(I18N_KEYS.OPACITY_HINT) ?? '',
    scope: 'world',
    config: true,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: 0.75,
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT) ?? 'Pause text',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  // Color picker using v14 built-in ColorField
  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_COLOR, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_COLOR) ?? 'Pause text color',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_COLOR_HINT) ?? '',
    scope: 'world',
    config: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: new (foundry.data.fields as any).ColorField(),
    default: '#ffffff',
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

  settings.register(MODULE_ID, SETTINGS.PAUSE_TEXT_SHADOW, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_SHADOW) ?? 'Pause text shadow',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_TEXT_SHADOW_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.ANIMATION_DIRECTION, {
    name: game.i18n?.localize(I18N_KEYS.ANIMATION_DIRECTION) ?? 'Animation direction',
    hint: game.i18n?.localize(I18N_KEYS.ANIMATION_DIRECTION_HINT) ?? '',
    scope: 'world',
    config: true,
    type: String,
    default: 'default',
    choices: {
      default: game.i18n?.localize(I18N_KEYS.DEFAULT) ?? 'Default',
      none: 'none',
      normal: 'normal',
      reverse: 'reverse',
      alternate: 'alternate',
      'alternate-reverse': 'alternate-reverse',
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
    default: '',
    requiresReload: false,
  });

  settings.register(MODULE_ID, SETTINGS.PAUSE_BACKGROUND, {
    name: game.i18n?.localize(I18N_KEYS.PAUSE_BACKGROUND) ?? 'Select background image',
    hint: game.i18n?.localize(I18N_KEYS.PAUSE_BACKGROUND_HINT) ?? '',
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

// Apply pause customizations when the GamePause overlay renders (v14 ApplicationV2 hook)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Hooks.on as (hook: string, fn: (...args: any[]) => void) => number)(
  'renderGamePause',
  (_app: unknown, element: HTMLElement, context: GamePauseContext, _options: unknown) => {
    if (!context.cssClass.includes('paused')) return;

    const settings = game.settings as unknown as FoundrySettings;
    const img = element.querySelector('img');
    const caption = element.querySelector('figcaption');
    if (!img || !caption) return;

    const pauseImage = settings.get(MODULE_ID, SETTINGS.CHOOSE_FILE) as string;
    const opacity = settings.get(MODULE_ID, SETTINGS.OPACITY) as number;
    const pauseText = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT) as string;
    const pauseTextFontFamily = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_FAMILY) as string;
    const pauseTextColor = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_COLOR) as string;
    const pauseTextFontSize = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_FONT_SIZE) as string;
    const pauseTextShadow = settings.get(MODULE_ID, SETTINGS.PAUSE_TEXT_SHADOW) as string;
    const animationDirection = settings.get(MODULE_ID, SETTINGS.ANIMATION_DIRECTION) as string;
    const animationDuration = settings.get(MODULE_ID, SETTINGS.ANIMATION_DURATION) as string;
    const animationTiming = settings.get(MODULE_ID, SETTINGS.ANIMATION_TIMING) as string;
    const pauseBackground = settings.get(MODULE_ID, SETTINGS.PAUSE_BACKGROUND) as string;

    // Animation direction
    if (animationDirection === 'none') {
      img.classList.remove('fa-spin');
    } else if (animationDirection !== 'default') {
      img.style.setProperty('--fa-animation-direction', animationDirection);
    }

    // Background image
    if (pauseBackground && animationDirection !== 'none') {
      if (pauseBackground === 'none') {
        element.style.backgroundImage = 'none';
      } else {
        element.style.backgroundImage = `url(../${pauseBackground})`;
      }
    }

    // Pause icon image
    if (pauseImage) {
      img.setAttribute('src', pauseImage);
    }

    // Opacity
    if (opacity !== undefined) {
      img.style.opacity = String(opacity);
    }

    // Animation duration
    if (animationDuration) {
      img.style.setProperty('--fa-animation-duration', animationDuration);
    }

    // Animation timing
    if (animationTiming) {
      img.style.setProperty('--fa-animation-timing', animationTiming);
    }

    // Pause text
    if (pauseText) {
      caption.textContent = pauseText;
    }

    // Font family
    if (pauseTextFontFamily && pauseTextFontFamily !== 'default') {
      caption.style.fontFamily = pauseTextFontFamily;
    }

    // Text color
    if (pauseTextColor) {
      caption.style.color = pauseTextColor;
    }

    // Font size
    if (pauseTextFontSize) {
      caption.style.fontSize = pauseTextFontSize;
    }

    // Text shadow
    if (pauseTextShadow) {
      caption.style.textShadow = pauseTextShadow;
    }
  }
);
