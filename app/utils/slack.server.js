const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackInstallNotification(shop) {
  const message = {
    text: `New App Install: ${shop.shopDomain}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: [
            `*New App Install* :tada:`,
            `*Shop:* ${shop.name || "N/A"}`,
            `*Domain:* ${shop.shopDomain}`,
            `*Email:* ${shop.email || shop.contactEmail || "N/A"}`,
            `*Plan:* ${shop.planDisplayName || "N/A"}`,
          ].join("\n"),
        },
      },
    ],
  };

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(
        "Slack webhook failed:",
        response.status,
        await response.text(),
      );
    }
  } catch (error) {
    console.error("Failed to send Slack notification:", error.message);
  }
}
