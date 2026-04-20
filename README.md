# Sender Cleanup – Thunderbird Add-on

A Thunderbird experiment add-on that **hides email addresses in the card view** – only the display name is shown, keeping your inbox clean and readable.

## ✨ Features

- Removes `Name <email@example.com>` → shows only `Name`
- Works in the card view (Thunderbird 128+)
- Runs automatically on startup
- Lightweight – no permissions, no tracking

## 📋 Requirements

- Thunderbird **128.0** or later
- macOS, Windows or Linux

## 📦 Installation

### Option A: Manual (XPI file)

1. Download the latest `.xpi` from [Releases](https://github.com/tinyprojekt/thunderbird-sender-cleanup/releases)
2. In Thunderbird: **Add-ons Manager** → gear icon → **Install Add-on From File…**
3. Select the `.xpi` file and confirm

### Option B: Build from source

```bash
git clone https://github.com/tinyprojekt/thunderbird-sender-cleanup.git
cd thunderbird-sender-cleanup
zip -r sender-cleanup.xpi . -x "*.git*" -x "*.DS_Store"
```

Then install the `.xpi` via the Add-ons Manager as described above.

## 🗂 File Structure

```
thunderbird-sender-cleanup/
├── manifest.json          # Add-on manifest (WebExtension)
├── background.js          # Background script
└── experiment/
    ├── api.js             # Experiment API (privileged code)
    └── schema.json        # Experiment schema
```

## 🔧 How it works

The add-on uses a **Thunderbird Experiment API** to access privileged browser internals. It attaches a `MutationObserver` to the mail thread pane and strips the `<email@example.com>` part from every `span.sender` element whenever the message list updates.

## 🎨 Pairs well with: Thunderbird Proton Theme

This add-on was built alongside the **[Thunderbird Proton Theme](https://github.com/tinyprojekt/thunderbird-proton-theme)** – a custom `userChrome.css` that brings the clean, dark aesthetic of Proton Mail to Thunderbird.

To ensure the date and three-dot menu stay right-aligned after sender names are shortened, add this to your `userChrome.css`:

```css
#threadTree tr[is="thread-card"] .sender {
    flex: 1 1 0 !important;
    min-width: 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
```

👉 **[View Thunderbird Proton Theme →](https://github.com/tinyprojekt/thunderbird-proton-theme)**

## 📄 License

MIT © [tinyprojekt](https://github.com/tinyprojekt)