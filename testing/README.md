## Dev
Initiliaze the project:
```bash
npm i
```
To add icons, put a 'logo.png' image in the public folder and run
```bash
npx pwa-asset-generator public/logo.png public/icons
```

When ready to dev:
```bash
npm run dev
```

### Test PWA
Run
```bash
npm run build && npm start
```
and generate a report with lighthouse - it should report as a valid, installabe, pwa. Remember to have added icons.
