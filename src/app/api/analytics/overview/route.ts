export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAnalyticsClient, getPropertyId } from "@/lib/analytics";

export async function GET() {
    try {
        const client = getAnalyticsClient();
        const propertyId = getPropertyId();

        // Today's data
        const [todayResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "today", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
            ],
        });

        // Yesterday's data for comparison
        const [yesterdayResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
            ],
        });

        // Last 7 days - daily breakdown for chart
        const [weeklyResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
            ],
            dimensions: [{ name: "date" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
        });

        // Last 30 days - daily breakdown for chart
        const [monthlyResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [
                { name: "activeUsers" },
                { name: "screenPageViews" },
                { name: "sessions" },
            ],
        });

        // Top pages last 7 days
        const [topPagesResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
            dimensions: [{ name: "pagePath" }],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 10,
        });

        // Traffic sources last 7 days
        const [sourcesResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "sessions" }, { name: "activeUsers" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: 8,
        });

        // Device breakdown last 7 days
        const [devicesResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "activeUsers" }],
            dimensions: [{ name: "deviceCategory" }],
        });

        // Parse helpers
        const parseRow = (row: any) => ({
            metrics: row.metricValues?.map((m: any) => parseFloat(m.value || "0")) || [],
            dimensions: row.dimensionValues?.map((d: any) => d.value || "") || [],
        });

        const todayRow = todayResponse.rows?.[0];
        const yesterdayRow = yesterdayResponse.rows?.[0];

        const today = {
            users: parseInt(todayRow?.metricValues?.[0]?.value || "0"),
            pageViews: parseInt(todayRow?.metricValues?.[1]?.value || "0"),
            sessions: parseInt(todayRow?.metricValues?.[2]?.value || "0"),
            avgDuration: parseFloat(todayRow?.metricValues?.[3]?.value || "0"),
            bounceRate: parseFloat(todayRow?.metricValues?.[4]?.value || "0"),
        };

        const yesterday = {
            users: parseInt(yesterdayRow?.metricValues?.[0]?.value || "0"),
            pageViews: parseInt(yesterdayRow?.metricValues?.[1]?.value || "0"),
            sessions: parseInt(yesterdayRow?.metricValues?.[2]?.value || "0"),
            avgDuration: parseFloat(yesterdayRow?.metricValues?.[3]?.value || "0"),
            bounceRate: parseFloat(yesterdayRow?.metricValues?.[4]?.value || "0"),
        };

        // Weekly chart data
        const weeklyChart = (weeklyResponse.rows || []).map((row) => {
            const parsed = parseRow(row);
            const dateStr = parsed.dimensions[0] || "";
            return {
                date: dateStr ? `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}` : "",
                users: parsed.metrics[0] || 0,
                pageViews: parsed.metrics[1] || 0,
            };
        });

        // 30-day totals
        const monthlyRow = monthlyResponse.rows?.[0];
        const monthly = {
            users: parseInt(monthlyRow?.metricValues?.[0]?.value || "0"),
            pageViews: parseInt(monthlyRow?.metricValues?.[1]?.value || "0"),
            sessions: parseInt(monthlyRow?.metricValues?.[2]?.value || "0"),
        };

        // Top pages
        const topPages = (topPagesResponse.rows || []).map((row) => {
            const parsed = parseRow(row);
            return {
                path: parsed.dimensions[0] || "/",
                views: parsed.metrics[0] || 0,
                users: parsed.metrics[1] || 0,
            };
        });

        // Traffic sources
        const sources = (sourcesResponse.rows || []).map((row) => {
            const parsed = parseRow(row);
            return {
                channel: parsed.dimensions[0] || "Unknown",
                sessions: parsed.metrics[0] || 0,
                users: parsed.metrics[1] || 0,
            };
        });

        // Device categories
        const devices = (devicesResponse.rows || []).map((row) => {
            const parsed = parseRow(row);
            return {
                device: parsed.dimensions[0] || "Unknown",
                users: parsed.metrics[0] || 0,
            };
        });

        return NextResponse.json({
            today,
            yesterday,
            weeklyChart,
            monthly,
            topPages,
            sources,
            devices,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error("Analytics Overview Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
