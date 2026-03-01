export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnalyticsClient, getPropertyId } from "@/lib/analytics";

export async function GET() {
    try {
        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        // Realtime report
        const [realtimeResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: "activeUsers" }],
            dimensions: [
                { name: "country" },
            ],
        });

        // Realtime by page
        const [realtimePageResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "unifiedScreenName" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 10,
        });

        // Realtime by device
        const [realtimeDeviceResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "deviceCategory" }],
        });

        // Realtime by source
        const [realtimeSourceResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "firstUserSource" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 8,
        });

        // Parse total active users
        let totalActiveUsers = 0;
        const byCountry: { country: string; users: number }[] = [];
        realtimeResponse.rows?.forEach((row) => {
            const users = parseInt(row.metricValues?.[0]?.value || "0");
            totalActiveUsers += users;
            byCountry.push({
                country: row.dimensionValues?.[0]?.value || "Unknown",
                users,
            });
        });

        // Parse by page
        const byPage: { page: string; users: number }[] = [];
        realtimePageResponse.rows?.forEach((row) => {
            byPage.push({
                page: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            });
        });

        // Parse by device
        const byDevice: { device: string; users: number }[] = [];
        realtimeDeviceResponse.rows?.forEach((row) => {
            byDevice.push({
                device: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            });
        });

        // Parse by source
        const bySource: { source: string; users: number }[] = [];
        realtimeSourceResponse.rows?.forEach((row) => {
            bySource.push({
                source: row.dimensionValues?.[0]?.value || "(direct)",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            });
        });

        return NextResponse.json({
            realtime: {
                activeUsers: totalActiveUsers,
                byCountry: byCountry.sort((a, b) => b.users - a.users),
                byPage,
                byDevice,
                bySource,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error("Analytics Realtime Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
