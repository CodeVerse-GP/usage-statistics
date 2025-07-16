import { DiscoveryApi, FetchApi } from "@backstage/core-plugin-api";
import { ResponseError } from "@backstage/errors";
import { UsageStatisticsApi } from "./UsageStatisticsApi";
import { TaskRun } from "../types";

export class UsageStatisticsClient implements UsageStatisticsApi {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;

    public constructor(options: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
    }) {
        this.discoveryApi = options.discoveryApi;
        this.fetchApi = options.fetchApi;
    }
    public async getTemplateStatsByName(templateName: string): Promise<TaskRun[]> {
        const encodedName = encodeURIComponent(templateName);
        const baseUrl = await this.discoveryApi.getBaseUrl("usage-statistics");
        const url = new URL(`usage-statistics/template/by-name/${encodedName}`, baseUrl);

        const response = await this.fetchApi.fetch(url.toString());
        if (!response.ok) {
            throw await ResponseError.fromResponse(response);
        }
        return response.json();
    }
}
