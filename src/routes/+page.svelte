<script lang="ts">
    import { curveBumpX } from "d3-shape";
    import {
        LineChart,
        defaultChartPadding,
        BarChart,
        Chart,
        Axis,
        LinearGradient,
        Layer,
        Spline,
    } from "layerchart";
    import { createDateSeries, f1Data, results } from "$lib/data";
    import { scaleThreshold, scaleLinear, scalePoint } from "d3-scale";
    import { cls } from "@layerstack/tailwind";

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
        "var(--color-cadillac)",
        "var(--color-astonmartin)",
    ];

    const sessions = ["FP2", "FP3", "Q1", "Q2", "Q", "R"];
    const sessionData = sessions.map((session, i) => {
        const row: Record<string, string | number> = { session };
        for (const result of results) {
            row[result.name] = result.ranks[i];
        }
        return row;
    });
    const maxRank = 51;
    const rowHeight = 14;
    const keys = results.map((r) => r.name);
    let hoveredState = $state<string | null>(null);
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
    c="Team"
    orientation="horizontal"
    cDomain={colorKeys}
    cRange={driverColors}
    padding={defaultChartPadding({ left: 50, right: 50 })}
    height={600}
/>

<Chart
    data={sessionData}
    x="session"
    xScale={scalePoint()}
    y={keys}
    yScale={scaleLinear()}
    yDomain={[maxRank + 0.5, 0.5]}
    padding={{ top: 30, bottom: 30, left: 14, right: 18 }}
    height={maxRank * rowHeight + 60}
>
    {#snippet children({ context })}
        <Layer>
            <LinearGradient
                id="gradient-improved"
                stops={["var(--color-success-700)", "var(--color-success-300)"]}
            />
            <LinearGradient
                id="gradient-declined"
                stops={["var(--color-danger-300)", "var(--color-danger-700)"]}
            />

            <Axis placement="top" rule={false} />
            <Axis placement="bottom" rule={false} />

            <!-- Lines (one Spline per state) -->
            {#each results as result (result.name)}
                {@const dimmed =
                    hoveredState !== null && hoveredState !== result.name}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <g
                    onmouseenter={() => (hoveredState = result.name)}
                    onmouseleave={() => (hoveredState = null)}
                    class={cls(
                        "transition-opacity duration-200",
                        dimmed && "opacity-[0.15]",
                    )}
                >
                    <Spline
                        y={result.name}
                        curve={curveBumpX}
                        stroke={(d) => {
                            const arr = sessionData;
                            const i = arr.findIndex(
                                (p) => p.session === d.session,
                            );
                            if (i >= arr.length - 1)
                                return "color-mix(in srgb, var(--color-surface-content) 30%, transparent)";
                            const from = d[result.name] as number;
                            const to = arr[i + 1][result.name] as number;
                            return from > to
                                ? "url(#gradient-improved)"
                                : from < to
                                  ? "url(#gradient-declined)"
                                  : "color-mix(in srgb, var(--color-surface-content) 30%, transparent)";
                        }}
                        strokeWidth={4}
                    />
                </g>
            {/each}

            <!-- Labels at each point -->
            {#each results as result (result.name)}
                {@const dimmed =
                    hoveredState !== null && hoveredState !== result.name}
                {#each sessionData as point, i (point.session)}
                    {@const x = context.xScale(point.session)}
                    {@const y = context.yScale(point[result.name])}
                    {@const from = result.ranks[i === 0 ? 0 : i - 1]}
                    {@const to = result.ranks[i === 0 ? 1 : i]}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <rect
                        x={x - 12}
                        y={y - rowHeight / 2}
                        width={24}
                        height={rowHeight}
                        class={cls(
                            "fill-surface-200 transition-opacity duration-200",
                            dimmed && "_opacity-10",
                        )}
                        onmouseenter={() => (hoveredState = result.name)}
                        onmouseleave={() => (hoveredState = null)}
                    />
                    <text
                        {x}
                        {y}
                        text-anchor="middle"
                        dominant-baseline="central"
                        pointer-events="none"
                        class={cls(
                            "text-[12px] font-semibold font-[monospace] transition-opacity duration-200",
                            from > to
                                ? "fill-success"
                                : from < to
                                  ? "fill-danger"
                                  : "fill-surface-content/50",
                            dimmed && "opacity-10",
                        )}
                    >
                        {result.name}
                    </text>
                {/each}
            {/each}
        </Layer>
    {/snippet}
</Chart>
