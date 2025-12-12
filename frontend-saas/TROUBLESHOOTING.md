# SaaS Frontend Troubleshooting

If the SaaS frontend is not running, try these steps:

## 1. Install Dependencies

Make sure all dependencies are installed:

```bash
cd src/frontend-saas
npm install
```

## 2. Check Port Availability

Make sure port 3002 is not already in use:

**Windows:**
```bash
netstat -ano | findstr :3002
```

**Linux/Mac:**
```bash
lsof -i :3002
```

If port 3002 is in use, either:
- Stop the process using that port, or
- Change the PORT in `package.json` start script

## 3. Manual Start

Try starting the SaaS frontend manually:

```bash
cd src/frontend-saas
npm start
```

This should start the app on `http://localhost:3002`

## 4. Check for Errors

Look for any error messages in the console. Common issues:

- **Module not found**: Run `npm install` again
- **Port already in use**: Change PORT or stop conflicting process
- **Syntax errors**: Check the browser console for specific errors

## 5. Clear Cache and Reinstall

If issues persist:

```bash
cd src/frontend-saas
rm -rf node_modules package-lock.json
npm install
npm start
```

## 6. Check Environment Variables

Make sure the backend is running on port 5000 (default). The SaaS frontend proxies API requests to `http://localhost:5000`.

## 7. Verify All Files Exist

Make sure these files exist:
- `src/frontend-saas/src/index.js`
- `src/frontend-saas/src/App.js`
- `src/frontend-saas/public/index.html`
- `src/frontend-saas/package.json`

## 8. Check Browser Console

Open the browser console (F12) and look for any JavaScript errors when accessing `http://localhost:3002`

## Common Solutions

### Error: "Cannot find module"
**Solution:** Run `npm install` in the `src/frontend-saas` directory

### Error: "Port 3002 already in use"
**Solution:** 
- Find and stop the process using port 3002, or
- Change PORT in package.json start script

### Error: "EADDRINUSE"
**Solution:** Another process is using port 3002. Stop it or use a different port.

### App loads but shows blank page
**Solution:** Check browser console for React errors. Common causes:
- Missing component exports
- Import path errors
- Missing CSS files

