export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnalyticsClient, getPropertyId, getCached, setCache } from "@/lib/analytics";

const CACHE_KEY = "analytics_realtime";
const CACHE_TTL = 30000; // 30 seconds

export async function GET() {
    try {
        // Return cached data if available
        const cached = getCached(CACHE_KEY);
        if (cached) return NextResponse.json(cached);

        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        // 1. Total active users (30 min)
        const [totalRes] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: "activeUsers" }],
        });
        const totalActiveUsers = parseInt(totalRes.rows?.[0]?.metricValues?.[0]?.value || "0");

        // 2. Active users per minute (for chart) - minutesAgo dimension
        let minuteChart: { minutesAgo: number; users: number }[] = [];
        try {
            const [minuteRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "minutesAgo" }],
            });
            minuteChart = (minuteRes.rows || []).map(row => ({
                minutesAgo: parseInt(row.dimensionValues?.[0]?.value || "0"),
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.minutesAgo - a.minutesAgo);

            // Fill in missing minutes (0-29) with 0
            const filledChart: { minutesAgo: number; users: number }[] = [];
            for (let i = 29; i >= 0; i--) {
                const found = minuteChart.find(m => m.minutesAgo === i);
                filledChart.push({ minutesAgo: i, users: found?.users || 0 });
            }
            minuteChart = filledChart;
        } catch (e) { console.error("Minute chart error:", e); }

        // Calculate active users in last 5 minutes
        const activeUsers5Min = minuteChart
            .filter(m => m.minutesAgo < 5)
            .reduce((s, m) => s + m.users, 0);

        // 3. Pages with path + views + active users
        let byPage: { page: string; users: number; views: number }[] = [];
        try {
            const [pageRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
                dimensions: [{ name: "unifiedScreenName" }],
            });
            byPage = (pageRes.rows || []).map(row => ({
                page: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
                views: parseInt(row.metricValues?.[1]?.value || "0"),
            })).sort((a, b) => b.users - a.users).slice(0, 15);
        } catch (e) { console.error("Page realtime error:", e); }

        // 3b. Pages by path (pagePath gives URL path)
        let byPagePath: { path: string; users: number; views: number }[] = [];
        try {
            const [pathRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
                dimensions: [{ name: "unifiedPagePathScreen" }],
            });
            byPagePath = (pathRes.rows || []).map(row => ({
                path: row.dimensionValues?.[0]?.value || "/",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
                views: parseInt(row.metricValues?.[1]?.value || "0"),
            })).sort((a, b) => b.views - a.views).slice(0, 15);
        } catch (e) { console.error("PagePath realtime error:", e); }

        // 4. By country
        let byCountry: { country: string; users: number }[] = [];
        try {
            const [countryRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "country" }],
            });
            byCountry = (countryRes.rows || []).map(row => ({
                country: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.users - a.users);
        } catch (e) { console.error("Country error:", e); }

        // 5. By city
        let byCity: { city: string; users: number }[] = [];
        try {
            const [cityRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "city" }],
            });
            byCity = (cityRes.rows || []).map(row => ({
                city: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.users - a.users).slice(0, 10);
        } catch (e) { console.error("City error:", e); }

        // 6. By device
        let byDevice: { device: string; users: number }[] = [];
        try {
            const [deviceRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "deviceCategory" }],
            });
            byDevice = (deviceRes.rows || []).map(row => ({
                device: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.users - a.users);
        } catch (e) { console.error("Device error:", e); }

        // 7. By traffic source
        let bySource: { source: string; users: number }[] = [];
        try {
            const [sourceRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "firstUserSource" }],
            });
            bySource = (sourceRes.rows || []).map(row => ({
                source: row.dimensionValues?.[0]?.value || "(direct)",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.users - a.users).slice(0, 10);
        } catch (e) { console.error("Source error:", e); }

        // 8. Events breakdown (realtime)
        let events: { name: string; count: number }[] = [];
        try {
            const [eventRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "eventCount" }],
                dimensions: [{ name: "eventName" }],
            });
            events = (eventRes.rows || []).map(row => ({
                name: row.dimensionValues?.[0]?.value || "Unknown",
                count: parseInt(row.metricValues?.[0]?.value || "0"),
            })).sort((a, b) => b.count - a.count);
        } catch (e) { console.error("Events error:", e); }

        // 9. Total page views (30 min)
        let totalPageViews = 0;
        try {
            const [viewsRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "screenPageViews" }],
            });
            totalPageViews = parseInt(viewsRes.rows?.[0]?.metricValues?.[0]?.value || "0");
        } catch (e) { console.error("Views error:", e); }

        // 10. Audience type (new vs returning)
        let byAudience: { type: string; users: number }[] = [];
        try {
            const [audienceRes] = await client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "audienceId" }],
            });
            byAudience = (audienceRes.rows || []).map(row => ({
                type: row.dimensionValues?.[0]?.value || "Unknown",
                users: parseInt(row.metricValues?.[0]?.value || "0"),
            }));
        } catch (e) { /* Audience dimension may not be available */ }

        const result = {
            realtime: {
                activeUsers: totalActiveUsers,
                activeUsers5Min,
                totalPageViews,
                minuteChart,
                byPage,
                byPagePath,
                byCountry,
                byCity,
                byDevice,
                bySource,
                events,
                byAudience,
            },
            timestamp: new Date().toISOString(),
        };
        setCache(CACHE_KEY, result, CACHE_TTL);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Analytics Realtime Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
