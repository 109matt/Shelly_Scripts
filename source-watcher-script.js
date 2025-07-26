// Shelly 1 Mini Gen3 - Conditional Webhook Timer
// This script provides a 2-minute auto-off timer ONLY when the light is activated by a simple HTTP webhook.
// Manual activation via app, cloud, or physical switch will keep the light on indefinitely.

// This handler function runs every time the switch status changes.
Shelly.addStatusHandler(function(status) {
  // We only care about changes to "switch:0"
  if (typeof status.component !== "string" || status.component.indexOf("switch:0") === -1) {
    return;
  }

  // Check if the light was just turned ON.
  if (status.delta.output === true) {
    
    // Check if the source of the command was 'http'.
    // The simple /relay/0?turn=on command has the source 'http'.
    if (status.delta.source === "http") {
      print("Light turned on by HTTP webhook. Starting 2-minute timer.");
      
      Timer.set(120 * 1000, false, function() {
        print("Auto-off timer expired. Turning light off.");
        Shelly.call("Switch.Set", { id: 0, on: false });
      });
      
    } else {
      // If turned on by the app, cloud, a schedule, or a physical switch, we do nothing.
      print("Light turned on by other source (" + status.delta.source + "). No timer will be started.");
    }
  }
});

print("Source Watcher Script is running and actively monitoring the floodlight.");
