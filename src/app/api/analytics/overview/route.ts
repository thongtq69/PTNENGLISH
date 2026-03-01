export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnalyticsClient, getPropertyId } from "@/lib/analytics";

export async function GET() {
    try {
        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        // ── Today vs Yesterday ──
        const [todayRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "today", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
                { name: "newUsers" },
                { name: "eventCount" },
            ],
        });

        const [yesterdayRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
                { name: "newUsers" },
                { name: "eventCount" },
            ],
        });

        // ── 7-days daily chart ──
        const [weeklyChartRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
                { name: "newUsers" },
            ],
            dimensions: [{ name: "date" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
        });

        // ── 30 days total ──
        const [monthlyRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
                { name: "newUsers" },
                { name: "eventCount" },
            ],
        });

        // ── Top pages (7 days) ──
        const [topPagesRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
            ],
            dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 15,
        });

        // ── Traffic sources (7 days) ──
        const [sourcesRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "newUsers" }, { name: "bounceRate" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: 10,
        });

        // ── Source / Medium (7 days) ──
        const [sourceMediumRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "sessions" }, { name: "activeUsers" }],
            dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: 10,
        });

        // ── Devices (7 days) ──
        const [devicesRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            dimensions: [{ name: "deviceCategory" }],
        });

        // ── Browser (7 days) ──
        const [browserRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "browser" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 8,
        });

        // ── Country (7 days) ──
        const [countryRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            dimensions: [{ name: "country" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 10,
        });

        // ── City (7 days) ──
        const [cityRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            dimensions: [{ name: "city" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 10,
        });

        // ── User engagement events (7 days) ──
        const [eventsRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "eventCount" }, { name: "eventCountPerUser" }],
            dimensions: [{ name: "eventName" }],
            orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
            limit: 15,
        });

        // ── New vs Returning (7 days) ──
        const [newVsReturnRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            dimensions: [{ name: "newVsReturning" }],
        });

        // ── OS (7 days) ──
        const [osRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "operatingSystem" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 8,
        });

        // ── Screen resolution (7 days) ──
        const [screenRes] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "screenResolution" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 8,
        });

        // Helper parsers
        const parseMetrics = (row: any) =>
            row?.metricValues?.map((m: any) => parseFloat(m.value || "0")) || [];
        const parseDims = (row: any) =>
            row?.dimensionValues?.map((d: any) => d.value || "") || [];

        const todayM = parseMetrics(todayRes.rows?.[0]);
        const yesterdayM = parseMetrics(yesterdayRes.rows?.[0]);

        const today = {
            users: todayM[0] || 0, pageViews: todayM[1] || 0, sessions: todayM[2] || 0,
            avgDuration: todayM[3] || 0, bounceRate: todayM[4] || 0,
            newUsers: todayM[5] || 0, events: todayM[6] || 0,
        };
        const yesterday = {
            users: yesterdayM[0] || 0, pageViews: yesterdayM[1] || 0, sessions: yesterdayM[2] || 0,
            avgDuration: yesterdayM[3] || 0, bounceRate: yesterdayM[4] || 0,
            newUsers: yesterdayM[5] || 0, events: yesterdayM[6] || 0,
        };

        const monthlyM = parseMetrics(monthlyRes.rows?.[0]);
        const monthly = {
            users: monthlyM[0] || 0, pageViews: monthlyM[1] || 0, sessions: monthlyM[2] || 0,
            avgDuration: monthlyM[3] || 0, bounceRate: monthlyM[4] || 0,
            newUsers: monthlyM[5] || 0, events: monthlyM[6] || 0,
        };

        const weeklyChart = (weeklyChartRes.rows || []).map((row) => {
            const d = parseDims(row);
            const m = parseMetrics(row);
            const ds = d[0] || "";
            return {
                date: ds ? `${ds.substring(6, 8)}/${ds.substring(4, 6)}` : "",
                fullDate: ds,
                users: m[0] || 0, pageViews: m[1] || 0, sessions: m[2] || 0, newUsers: m[3] || 0,
            };
        });

        const mapRows = (rows: any[], dimCount: number) =>
            (rows || []).map((row) => ({
                dims: parseDims(row).slice(0, dimCount),
                metrics: parseMetrics(row),
            }));

        return NextResponse.json({
            today, yesterday, monthly, weeklyChart,
            topPages: mapRows(topPagesRes.rows, 2).map(r => ({
                path: r.dims[0], title: r.dims[1], views: r.metrics[0], users: r.metrics[1],
                avgDuration: r.metrics[2], bounceRate: r.metrics[3],
            })),
            sources: mapRows(sourcesRes.rows, 1).map(r => ({
                channel: r.dims[0], sessions: r.metrics[0], users: r.metrics[1],
                newUsers: r.metrics[2], bounceRate: r.metrics[3],
            })),
            sourceMedium: mapRows(sourceMediumRes.rows, 2).map(r => ({
                source: r.dims[0], medium: r.dims[1], sessions: r.metrics[0], users: r.metrics[1],
            })),
            devices: mapRows(devicesRes.rows, 1).map(r => ({
                device: r.dims[0], users: r.metrics[0], sessions: r.metrics[1],
            })),
            browsers: mapRows(browserRes.rows, 1).map(r => ({
                browser: r.dims[0], users: r.metrics[0],
            })),
            countries: mapRows(countryRes.rows, 1).map(r => ({
                country: r.dims[0], users: r.metrics[0], sessions: r.metrics[1],
            })),
            cities: mapRows(cityRes.rows, 1).map(r => ({
                city: r.dims[0], users: r.metrics[0], sessions: r.metrics[1],
            })),
            events: mapRows(eventsRes.rows, 1).map(r => ({
                name: r.dims[0], count: r.metrics[0], perUser: r.metrics[1],
            })),
            newVsReturn: mapRows(newVsReturnRes.rows, 1).map(r => ({
                type: r.dims[0], users: r.metrics[0], sessions: r.metrics[1],
            })),
            os: mapRows(osRes.rows, 1).map(r => ({
                os: r.dims[0], users: r.metrics[0],
            })),
            screens: mapRows(screenRes.rows, 1).map(r => ({
                resolution: r.dims[0], users: r.metrics[0],
            })),
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error("Analytics Overview Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
