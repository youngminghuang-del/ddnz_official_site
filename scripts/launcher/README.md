# DDNZ Content Ops macOS launcher

This launcher starts the local, Notion-connected content workspace at
`http://127.0.0.1:3000/content-ops` and opens it in the default browser.

## Install it on the desktop

1. In Finder, open `scripts/launcher` inside this project.
2. Double-click `install-desktop-launcher.command`.
3. Double-click **DDNZ Content Ops.command** on the Desktop whenever you want to use the workspace.

The desktop file is only a small wrapper. It always launches the script in this
project, so launcher improvements apply without reinstalling it. If the project
is moved to another folder, run the installer again from its new location.

## What it checks

Before starting, it confirms that macOS, Node.js, npm, `node_modules`, `.env.local`,
`NOTION_API_KEY`, and `NOTION_DATABASE_ID` are available. It does not print or
read the secret values. It also reuses a working DDNZ server and will not kill
or replace another program using port 3000.

If something is wrong, a macOS dialog gives the next action. Startup logs are
stored in the temporary folder shown in that dialog.

## First-time project setup

Run this once from the project folder before installing the launcher:

    npm install

Create `.env.local` from `.env.example` and add the Notion credentials. The
launcher intentionally does not run `npm install` or create secrets for you.
