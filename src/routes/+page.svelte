<script lang="ts">
    import { LineChart, defaultChartPadding, BarChart } from "layerchart";
    import { createDateSeries, f1Data } from "$lib/data";
    import { scaleThreshold } from "d3-scale";

    const data = createDateSeries({
        count: 30,
        min: -50,
        max: 100,
        value: "integer",
    });

    const colorKeys = [...new Set(f1Data.map((driver) => driver.Team))];
    const driverColors = [
        "var(--color-mercedes)",
        "var(--color-ferrari)",
        "var(--color-mcclaren)",
        "var(--color-redbull)",
        "var(--color-racingbulls)",
        "var(--color-audi)",
        "var(--color-alpine)",
        "var(--color-haas)",
        "var(--color-williams)",
        "var(--color-astonmartin)",
        "var(--color-cadillac)",
    ];
</script>

<h1>Welcome to My Project</h1>

<h2>Daily Value Change</h2>
<LineChart
    {data}
    x="date"
    y="value"
    padding={defaultChartPadding({ right: 10 })}
    height={300}
/>

<h2>Daily Value Threshold</h2>
<BarChart
    {data}
    x="date"
    y="value"
    c="value"
    cScale={scaleThreshold()}
    cDomain={[0]}
    cRange={["var(--color-danger)", "var(--color-success)"]}
    padding={defaultChartPadding({ right: 10 })}
    height={300}
/>

<h2>F1</h2>
<BarChart
    data={f1Data}
    x="LapTimeDelta"
    y="Driver"
    c="Color"
    orientation="horizontal"
    // cScale={scaleThreshold()}
    cDomain={colorKeys}
    cRange={driverColors}
    padding={defaultChartPadding({ left: 50, right: 50 })}
    height={600}
/>
