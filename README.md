# Birthday PIN Lock

A tiny, single-page numeric passcode lock with a pastel green theme.

## Use
- Open `index.html` in your browser.
- Click keypad buttons or type digits on your keyboard.
- Press Unlock or Enter.

## Customize
- Change the passcode in `script.js` by editing:
  const CORRECT_PIN = "1025";
- Update hidden content inside the `#protected` section of `index.html`.
- Adjust theme colors in `style.css` under the `:root` variables.

## Notes
- The input is read-only to keep interaction on the on-screen keypad and keyboard.
- This is a front-end-only gate; do not use for real security.
