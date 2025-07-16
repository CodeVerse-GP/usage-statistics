import { InfoCard, Progress } from "@backstage/core-components";
import Alert from "@material-ui/lab/Alert";
import { useEntity } from "@backstage/plugin-catalog-react";
import { useTemplateTaskRuns } from "../../../hooks/useTemplateTaskRuns";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { green, red, grey } from "@material-ui/core/colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import TimelineIcon from "@material-ui/icons/Timeline";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";


export const UsageSummaryCard = () => {
    const { entity } = useEntity();
    const templateName = entity.metadata.name;
    const { taskRuns, loading, error } = useTemplateTaskRuns(templateName);

    if (loading) {
        return <Progress />;
    }

    if (error || !taskRuns || taskRuns.length === 0) {
        return (
            <InfoCard title="Usage Summary">
                <Alert severity="error">
                    {error ? error.message : "No task runs found for this template."}
                </Alert>
            </InfoCard>
        ); 
    }

    const totalRuns = taskRuns.length;
    const successCount = taskRuns.filter(t => t.status === "completed").length;
    const failedCount = taskRuns.filter(t => t.status === "failed").length;
    const successRate = totalRuns > 0 ? ((successCount / totalRuns) * 100).toFixed(2) : "0.00";

    const StatCard = ({
        label,
        value,
        icon,
        color,
    }: {
        label: string;
        value: string | number;
        icon: JSX.Element;
        color?: string;
        }) => (
            <Card variant="outlined" style={{ height: "100%" }}>
                <CardContent>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            {icon}
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2" color="textSecondary">
                                {label}
                            </Typography>
                            <Typography variant="h6" style={{ color: color ?? grey[900] }}>
                                {value}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );

        return (
            <InfoCard title="Usage Summary">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            label="Total Runs"
                            value={totalRuns}
                            icon={<TimelineIcon color="action" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            label="Successful Runs"
                            value={successCount}
                            icon={<CheckCircleIcon style={{ color: green[600] }} />}
                            color={green[700]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            label="Failed Runs"
                            value={failedCount}
                            icon={<ErrorIcon style={{ color: red[600] }} />}
                            color={red[700]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            label="Success Rate"
                            value={`${successRate}%`}
                            icon={<TrendingUpIcon color="primary" />}
                            color={parseFloat(successRate) >= 80 ? green[700] : red[700]}
                        />
                    </Grid>
                </Grid>
            </InfoCard>
        );
};
