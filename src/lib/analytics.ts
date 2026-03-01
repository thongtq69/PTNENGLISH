import { BetaAnalyticsDataClient } from "@google-analytics/data";

let analyticsClient: BetaAnalyticsDataClient | null = null;

export function getAnalyticsClient() {
    if (!analyticsClient) {
        const clientEmail = process.env.GA_CLIENT_EMAIL;
        const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");

        if (!clientEmail || !privateKey) {
            throw new Error("Google Analytics credentials not configured");
        }

        analyticsClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });
    }
    return analyticsClient;
}

export function getPropertyId() {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId || propertyId === "PASTE_YOUR_PROPERTY_ID_HERE") {
        throw new Error("GA_PROPERTY_ID not configured in .env");
    }
    return propertyId;
}
