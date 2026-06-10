import axiosClient from "@/api/axios-client";
import type { StatisticsSummary, StatisticsTimeseries, StatisticsResponse, TimeseriesParams } from "@/types/statistics";

export async function getStatisticsSummary() {
    const response = await axiosClient.get<StatisticsResponse<StatisticsSummary>>("/admin/statistics/summary");
    return response.data.data;
}

export async function getStatisticsTimeseries(params?: TimeseriesParams) {
    const response = await axiosClient.get<StatisticsResponse<StatisticsTimeseries>>("/admin/statistics/timeseries", { params });
    return response.data.data;
}