import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getStatisticsSummary, getStatisticsTimeseries } from "@/data/queries/statistics";
import type { StatisticsSummary, StatisticsTimeseries, TimeseriesPoint } from "@/types/statistics";
import { Button } from "@/components/ui/Button";

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: number;
    sub?: string;
    color: string;
    icon: string;
}

const StatCard = ({ label, value, sub, color, icon }: StatCardProps) => (
    <div className={`bg-white rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-lg transition-shadow p-4`}>
        <div className={`text-3xl p-2 rounded-xl ${color}`}>{icon}</div>
        <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ─── Date range presets ───────────────────────────────────────────────────────

const toIso = (d: Date) => d.toISOString().split("T")[0];

const PRESETS = [
    {
        label: "Last 7 days",
        from: () => toIso(new Date(Date.now() - 7 * 86400000)),
        to: () => toIso(new Date()),
    },
    {
        label: "Last 30 days",
        from: () => toIso(new Date(Date.now() - 30 * 86400000)),
        to: () => toIso(new Date()),
    },
    {
        label: "Last 90 days",
        from: () => toIso(new Date(Date.now() - 90 * 86400000)),
        to: () => toIso(new Date()),
    },
    {
        label: "All time",
        from: () => "",
        to: () => "",
    },
];

// ─── Format date for chart axis ───────────────────────────────────────────────

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// ─── Merge timeseries arrays by date ─────────────────────────────────────────

interface ChartPoint {
    date: string;
    announcements?: number;
    users?: number;
    comments?: number;
}

const mergeTimeseries = (timeseries: StatisticsTimeseries): ChartPoint[] => {
    const map = new Map<string, ChartPoint>();

    const add = (arr: TimeseriesPoint[] | undefined, key: keyof Omit<ChartPoint, "date">) => {
        arr?.forEach(({ date, count }) => {
            const day = date.split("T")[0];
            const existing = map.get(day) ?? { date: day };
            map.set(day, { ...existing, [key]: count });
        });
    };

    add(timeseries.announcements, "announcements");
    add(timeseries.users, "users");
    add(timeseries.comments, "comments");

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Statistics = () => {
    const [summary, setSummary] = useState<StatisticsSummary | null>(null);
    const [timeseries, setTimeseries] = useState<StatisticsTimeseries | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);

    const [activePreset, setActivePreset] = useState(1); // "Last 30 days"
    const [fromDate, setFromDate] = useState(PRESETS[1].from());
    const [toDate, setToDate] = useState(PRESETS[1].to());
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [showCustom, setShowCustom] = useState(false);

    const loadSummary = async () => {
        setLoadingSummary(true);
        try {
            const data = await getStatisticsSummary();
            setSummary(data);
        } catch {
            setError("Failed to load summary statistics.");
        } finally {
            setLoadingSummary(false);
        }
    };

    const loadTimeseries = async (from: string, to: string) => {
        setLoadingChart(true);
        try {
            const data = await getStatisticsTimeseries({
                from: from || undefined,
                to: to || undefined,
            });
            setTimeseries(data);
        } catch {
            setError("Failed to load timeseries data.");
        } finally {
            setLoadingChart(false);
        }
    };

    useEffect(() => {
        void loadSummary();
    }, []);

    useEffect(() => {
        void loadTimeseries(fromDate, toDate);
    }, [fromDate, toDate]);

    const applyPreset = (index: number) => {
        const p = PRESETS[index];
        setActivePreset(index);
        setFromDate(p.from());
        setToDate(p.to());
        setShowCustom(false);
    };

    const applyCustom = () => {
        setActivePreset(-1);
        setFromDate(customFrom);
        setToDate(customTo);
        setShowCustom(false);
    };

    const chartData = timeseries ? mergeTimeseries(timeseries) : [];
    const hasUsers = timeseries?.users && timeseries.users.length > 0;
    const hasComments = timeseries?.comments && timeseries.comments.length > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-2xl p-6">
                <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Platform overview — users, announcements, comments and pets.
                </p>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm flex items-center justify-between">
                    {error}
                    <button className="font-bold text-red-400 hover:text-red-600 ml-3" onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Summary cards */}
            {loadingSummary ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} />
                    ))}
                </div>
            ) : summary ? (
                <>
                    {/* Users group */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 pl-1">
                            Users
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <StatCard
                                label="Total Users"
                                value={summary.totalUsers}
                                color="bg-blue-50"
                                icon="👥"
                            />
                            <StatCard
                                label="Onboarded"
                                value={summary.usersOnboarded}
                                sub="completed profile"
                                color="bg-indigo-50"
                                icon="✅"
                            />
                            <StatCard
                                label="New (30 days)"
                                value={summary.usersRegisteredLast30Days}
                                color="bg-sky-50"
                                icon="🆕"
                            />
                        </div>
                    </section>

                    {/* Announcements group */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 pl-1">
                            Announcements
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <StatCard
                                label="Total"
                                value={summary.totalAnnouncements}
                                color="bg-amber-50"
                                icon="📢"
                            />
                            <StatCard
                                label="Active"
                                value={summary.activeAnnouncements}
                                color="bg-green-50"
                                icon="🟢"
                            />
                            <StatCard
                                label="Archived"
                                value={summary.archivedAnnouncements}
                                color="bg-gray-100"
                                icon="📦"
                            />
                            <StatCard
                                label="New (30 days)"
                                value={summary.announcementsLast30Days}
                                color="bg-yellow-50"
                                icon="📅"
                            />
                            <StatCard
                                label="Lost"
                                value={summary.lostAnnouncements}
                                color="bg-red-50"
                                icon="🔴"
                            />
                            <StatCard
                                label="Found"
                                value={summary.foundAnnouncements}
                                color="bg-emerald-50"
                                icon="🟣"
                            />
                        </div>
                    </section>

                    {/* Comments & Pets */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 pl-1">
                            Other
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <StatCard
                                label="Total Comments"
                                value={summary.totalComments}
                                sub={`${summary.commentsLast30Days} last 30 days`}
                                color="bg-purple-50"
                                icon="💬"
                            />
                            <StatCard
                                label="Total Pets"
                                value={summary.totalPets}
                                color="bg-pink-50"
                                icon="🐾"
                            />
                        </div>
                    </section>
                </>
            ) : null}

            {/* Timeseries chart */}
            <div className="bg-white shadow rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <h2 className="text-lg font-bold text-gray-900">Activity over time</h2>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {PRESETS.map((p, i) => (
                            <Button
                                key={p.label}
                                size="sm"
                                variant={activePreset === i ? "primary" : "secondary"}
                                onClick={() => applyPreset(i)}
                            >
                                {p.label}
                            </Button>
                        ))}
                        <Button
                            size="sm"
                            variant={showCustom ? "primary" : "secondary"}
                            onClick={() => setShowCustom((v) => !v)}
                        >
                            Custom range
                        </Button>
                    </div>
                </div>

                {/* Custom range picker */}
                {showCustom && (
                    <div className="flex flex-wrap gap-3 items-end mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={applyCustom}
                            disabled={!customFrom && !customTo}
                        >
                            Apply
                        </Button>
                    </div>
                )}

                {loadingChart ? (
                    <div className="h-72 bg-gray-100 animate-pulse rounded-xl" />
                ) : chartData.length === 0 ? (
                    <div className="h-72 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <p className="text-4xl mb-2">📊</p>
                            <p>No data for this period</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAnnouncements" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 12, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                width={32}
                            />
                            <Tooltip
                                labelFormatter={(label) => formatDate(String(label))}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                    fontSize: "13px",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="announcements"
                                name="Announcements"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fill="url(#colorAnnouncements)"
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                            {hasUsers && (
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    name="Users"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#colorUsers)"
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            )}
                            {hasComments && (
                                <Area
                                    type="monotone"
                                    dataKey="comments"
                                    name="Comments"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    fill="url(#colorComments)"
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                )}

                {timeseries && (
                    <p className="text-xs text-gray-400 mt-3 text-right">
                        Period: {formatDate(timeseries.from)} — {formatDate(timeseries.to)}
                    </p>
                )}
            </div>
        </div>
    );
};