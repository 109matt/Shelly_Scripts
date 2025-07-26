# Shelly_Scripts
Home Automations scripts form Shelly 1 mini Gen3

Advanced Shelly Script: Conditional Webhook Timer
This script for the Shelly 1 Mini Gen3 enables a dual-functionality for a single light: a short, timed activation via a webhook (e.g., from a CCTV system) and a standard manual override that can stay on indefinitely.

The Problem
I needed a floodlight to perform two different tasks:

Security Light: When my UniFi CCTV system detects a person, it should trigger a webhook to turn the floodlight on for exactly 2 minutes.

Manual Light: I need to be able to turn the same floodlight on manually (via the app or a physical switch) and have it stay on for an extended period for deliveries or other activities, without it automatically turning off.

Using the Shelly's built-in "Auto Off" timer solves the first case but breaks the second, as it forces the light off after 2 minutes regardless of how it was turned on.

Device Limitations: Shelly 1 Mini Gen3
This script was developed as a workaround for significant limitations discovered in the API of the Shelly 1 Mini Gen3 (tested on stable firmware 1.6.2 and beta 1.7.0-beta3).

Unlike Shelly "Plus" or "Pro" models, the Mini Gen3's firmware does not support:

External RPC calls to start/stop/call scripts (e.g., Script.Start, Script.Call).

External RPC calls to execute saved Actions (e.g., Action.Execute).

The inbound HTTP server object within scripts (HTTP.registerEndpoint).

The Shelly.exit() command.

Creating "Actions" without a local event trigger.

This severely restricts how the device can be controlled externally, necessitating the "source watcher" approach of this script.

How It Works: The "Source Watcher" Solution
Since we cannot create a dedicated webhook listener or call a script directly, this solution uses a script that runs continuously in the background and monitors the status of the switch.

The script uses Shelly.addStatusHandler to be notified every time the switch component's status changes.

When the light is turned on, the handler inspects the source of the command.

If the source is "http", the script knows it was turned on by the simple Gen1-compatibility webhook (/relay/0?turn=on). It then starts a 120-second timer to turn the light off.

If the source is anything else (e.g., "cloud", "input", "mqtt"), the script recognizes it as a manual command and does nothing, allowing the light to stay on indefinitely.

This logic effectively separates the two use cases without needing a more complex API.

Setup Instructions
Clean Slate: On your Shelly 1 Mini Gen3's web interface, go to Actions and Scripts and delete or disable any existing configurations to prevent conflicts.

Disable Timers: Go to Settings -> Timers and ensure the AUTO OFF timer is disabled (set to 0).

Install the Script:

Go to the Scripts menu.

Create a new script.

Copy and paste the code from the source-watcher-script.js file below.

Save and Enable the script. It will now run continuously, which is correct.

Usage
Timed Trigger (CCTV Webhook)
To trigger the 2-minute timer, configure your external system (e.g., UniFi, Home Assistant, etc.) to send a simple HTTP GET request to this URL:

http://<YOUR_SHELLY_IP>/relay/0?turn=on


Manual Override
To turn the light on indefinitely, use the Shelly mobile app, the local web interface, or a physically connected switch as you normally would. The script will see the source is not http and will not start the auto-off timer.


