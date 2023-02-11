# Bread
by tobyxdd, modified by ltGuillaume: [Codeberg](https://codeberg.org/ltGuillaume) | [GitHub](https://github.com/ltGuillaume) | [Buy me a beer](https://buymeacoff.ee/ltGuillaume) 🍺

An open-source [Bionic reading](https://bionic-reading.com) userscript implementation.

![Screenshot](SCREENSHOT.png)

## Getting started
1. Install a userscript manager in your browser (this script has been tested with [ViolentMonkey](https://violentmonkey.github.io/get-it/))
2. Open [bread.user.js](bread.user.js?raw=1) and confirm installation

### Configurable values
Key | Value | Description
-- | -- | --
`MinWordLength` | `4` | Minimum length of a word to be "bionified"
`MinTextLength` | `20` | Minimum length of a paragraph to be "bionified"
`BoldRatio` | `.4` | Percentage of letters in each word that will be bolded
`ProcessDyn` | `True` | Whether to process dynamically loaded content
`BreadNodes` | `{}` | Restrict bread to a specific node per domain (use a CSS query): `{"domain": "#css_selector", ...}`

You can change these values in your userscript manager.

## Credits
- Renato Casutt for the [Bionic Reading](https://bionic-reading.com) method
- [tobyxdd](https://github.com/tobyxdd) for his implementation of Bionic Reading ([get it on OpenUserJS](https://openuserjs.org/scripts/tobyxdd/Bread))