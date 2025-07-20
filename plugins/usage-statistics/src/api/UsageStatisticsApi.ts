import { createApiRef } from "@backstage/core-plugin-api";
import { MonthlyStat, TaskRun } from "../types";

export const usageStatisticsApiRef = createApiRef<UsageStatisticsApi>({
    id: "plugin.usagestatistics.service",
});

export interface UsageStatisticsApi {
    getTemplateStatsByName(templateName: string): Promise<TaskRun[]>;
    getMonthlyStatsByTemplateName(templateName: string): Promise<MonthlyStat[]>;
}
