import { useApi } from "@backstage/core-plugin-api";
import useAsync from "react-use/esm/useAsync";
import { usageStatisticsApiRef } from "../api";
import { TaskRun } from "../types";

export function useTemplateTaskRuns(templateName: string): {
    taskRuns?: TaskRun[];
    loading: boolean;
    error?: Error;
} {
    const api = useApi(usageStatisticsApiRef);

    const { value, loading, error } = useAsync(() => {
        return api.getTemplateStatsByName(templateName);
    }, [api, templateName]);

    return {
        taskRuns: value,
        loading,
        error,
    };
}
