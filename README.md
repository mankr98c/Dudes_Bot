# 🎮 THE DUDES — Discord Server Bot

Custom Discord Bot designed for **THE DUDES** gaming and community server, built with Node.js and [discord.js v14](https://discord.js.org/).

---

## ⚡ Features Included

1. **🎭 Interactive Button Role Selector (`/setup-roles`)**
   - Clickable buttons for **Valorant**, **Apex Legends**, **Genshin Impact**, **BGMI**, **Anime Lounge**, **Movie Night**, and **Server Pings**.
   - Toggles roles automatically on click (click once to get the role, click again to remove it).
   - Ephemeral feedback (only the user sees the confirmation message).

2. **🔊 Dynamic "Join to Create" Temporary Voice Channels**
   - Automatically detects when a user joins the `➕ Join To Create` voice channel.
   - Creates a private room named `🎮・{Username}'s Room` in the same category.
   - Moves the user into their room and grants them channel management permissions.
   - Automatically deletes the temporary channel as soon as everyone leaves.

3. **🪂 LFG (Looking For Group) Squad System (`/lfg`)**
   - Interactive squad creator supporting **Apex Legends**, **Valorant**, **Genshin Impact**, **BGMI**, and other games.
   - Interactive buttons: `[🟢 Join Squad]`, `[🟡 Leave Squad]`, `[🔴 Cancel]`.
   - Live member tracking (`Current Squad: 2/3`) and auto-announces when the squad is full with direct voice channel reminders.

4. **📜 Professional Rules & Server Info**
   - `/setup-rules`: Deploys a clean, high-polish gaming rules embed.
   - `/server-info`: Displays live server stats, member counts, boost level, and channel counts.

---

## 🚀 Setup & Installation Guide

### Step 1: Create Your Bot on Discord Developer Portal

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** at top right and name it (e.g. `THE DUDES Bot`).
3. In the left sidebar, click **Bot**:
   * Click **Reset Token** and copy your **Bot Token**.
   * Scroll down to **Privileged Gateway Intents** and enable:
     * ✅ **Presence Intent**
     * ✅ **Server Members Intent**
     * ✅ **Message Content Intent**
   * Click **Save Changes**.
4. In the left sidebar, click **General Information**:
   * Copy the **Application ID** (this is your `CLIENT_ID`).

---

### Step 2: Invite the Bot to "THE DUDES"

1. In the left sidebar of Developer Portal, click **OAuth2** ➡️ **URL Generator**.
2. Under **Scopes**, check:
   * ✅ `bot`
   * ✅ `applications.commands`
3. Under **Bot Permissions**, check:
   * ✅ `Administrator` (recommended for auto-creating/deleting voice channels and assigning roles), or select `Manage Roles`, `Manage Channels`, `Move Members`, `Send Messages`, `Embed Links`.
4. Copy the generated URL at the bottom, paste it into your browser, and authorize it for **THE DUDES** server.

---

### Step 3: Enable Developer Mode in Discord

1. Open your Discord App.
2. Go to **User Settings** (gear icon) ➡️ **Advanced** ➡️ Turn ON **Developer Mode**.
3. Now you can right-click items to copy IDs:
   * Right-click **THE DUDES** server icon ➡️ **Copy Server ID** (this is `GUILD_ID`).
   * Right-click your `Join To Create` voice channel ➡️ **Copy Channel ID** (this is `JOIN_TO_CREATE_CHANNEL_ID`).

---

### Step 4: Configure Your `.env` File

Open the `.env` file in `p:\DC&BW\.env` and paste your IDs:

```env
DISCORD_TOKEN=your_copied_bot_token_here
CLIENT_ID=your_copied_application_id_here
GUILD_ID=your_copied_server_id_here

# Channel ID of your "➕ Join To Create" voice channel
JOIN_TO_CREATE_CHANNEL_ID=your_channel_id_here
```

*(Note: Roles like `Valorant`, `Apex Legends`, `Genshin`, `BGMI`, `Anime`, `Movie Night` can either be created in Server Settings > Roles with those exact names, or you can paste their IDs in `.env`)*

> **Important Role Hierarchy Tip:**
> In your Discord server: Go to **Server Settings** ➡️ **Roles**. Make sure the bot's role (e.g. `THE DUDES Bot`) is dragged **higher** than the game roles (`Valorant`, `Apex Legends`, etc.) so the bot has permission to assign them!

---

### Step 5: Deploy Commands & Start the Bot

In your terminal (`p:\DC&BW`):

1. **Register the slash commands:**
   ```bash
   npm run deploy
   ```
2. **Start the bot:**
   ```bash
   npm start
   ```

---

## 🎮 In-Discord Usage

* Go to your `#roles-selection` channel:
  ```text
  /setup-roles
  ```
  *(Posts the interactive button role picker)*

* Go to your `#rules` channel:
  ```text
  /setup-rules
  ```
  *(Posts the server guidelines embed)*

* Looking for teammates in Apex or Valorant:
  ```text
  /lfg game:Apex Legends slots:2 activity:Ranked Plat note:Need mic
  ```
  *(Posts the interactive team builder where players click to join)*

* Hop into `➕ Join To Create` in voice to automatically spawn your temporary room!
