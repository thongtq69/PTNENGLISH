export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnalyticsClient, getPropertyId } from "@/lib/analytics";

export async function GET() {
    try {
        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        // 1. Total active users (no dimensions)
        const [totalResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: "activeUsers" }],
        });

        const totalActiveUsers = parseInt(
            totalResponse.rows?.[0]?.metricValues?.[0]?.value || "0"
        );

        // 2. Active users by country
        let byCountry: { country: string; users: number }[] = [];
        try {
            const [countryResponse] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "country" }],
            });
            byCountry = (countryResponse.rows || []).map((row) => ({
                country: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.users - a.users);
        } catch (e) {
            console.error("Country breakdown error:", e);
        }

        // 3. Active users by page title
        let byPage: { page: string; users: number }[] = [];
        try {
            const [pageResponse] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "unifiedScreenName" }],
            });
            byPage = (pageResponse.rows || [])
                .map((row) => ({
                    page: row.dimensionValues?.[0]?.value || "Unknown",
                    users: parseInt(row.metricValues?.[0]?.value || "0"),
                }))
                .sort((a, b) => b.users - a.users)
                .slice(0, 10);
        } catch (e) {
            console.error("Page breakdown error:", e);
        }

        // 4. Active users by device
        let byDevice: { device: string; users: number }[] = [];
        try {
            const [deviceResponse] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "deviceCategory" }],
            });
            byDevice = (deviceResponse.rows || []).map((row) => ({
                device: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.users - a.users);
        } catch (e) {
            console.error("Device breakdown error:", e);
        }

        // 5. Active users by traffic source
        let bySource: { source: string; users: number }[] = [];
        try {
            const [sourceResponse] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "firstUserSource" }],
            });
            bySource = (sourceResponse.rows || [])
                .map((row) => ({
                    source: row.dimensionValues?.[0]?.value || "(direct)",
                    users: parseInt(row.metricValues?.[0]?.value || "0"),
                }))
                .sort((a, b) => b.users - a.users)
                .slice(0, 8);
        } catch (e) {
            console.error("Source breakdown error:", e);
        }

        return NextResponse.json({
            realtime: {
                activeUsers: totalActiveUsers,
                byCountry,
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
