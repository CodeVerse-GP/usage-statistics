import { createApiRef } from "@backstage/core-plugin-api";
import { TaskRun } from "../types";

export const usageStatisticsApiRef = createApiRef<UsageStatisticsApi>({
    id: "plugin.usagestatistics.service",
});

export interface UsageStatisticsApi {
    getTemplateStatsByName(templateName: string): Promise<TaskRun[]>;
}
