import { usageStatisticsPlugin } from './plugin';

describe('usage-statistics', () => {
  it('should export plugin', () => {
    expect(usageStatisticsPlugin).toBeDefined();
  });
});
