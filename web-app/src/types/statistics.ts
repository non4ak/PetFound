export interface StatisticsSummary {
    totalUsers: number;
    usersOnboarded: number;
    usersRegisteredLast30Days: number;
    totalAnnouncements: number;
    activeAnnouncements: number;
    archivedAnnouncements: number;
    lostAnnouncements: number;
    foundAnnouncements: number;
    announcementsLast30Days: number;
    totalComments: number;
    commentsLast30Days: number;
    totalPets: number;
}

export interface TimeseriesPoint {
    date: string;
    count: number;
}

export interface StatisticsTimeseries {
    from: string;
    to: string;
    announcements: TimeseriesPoint[];
    users?: TimeseriesPoint[];
    comments?: TimeseriesPoint[];
}

export interface StatisticsResponse<T> {
    message: string | null;
    data: T;
}

export interface TimeseriesParams {
    from?: string;
    to?: string;
}