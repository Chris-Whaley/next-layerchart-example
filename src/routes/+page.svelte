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
        Tooltip,
        Svg,
        Rect,
    } from "layerchart";
    import {
        createDateSeries,
        f1DataWithGap,
        results,
        stintData,
        stints,
        createStintChartData,
        getDrivers,
        getRaceDistance,
    } from "$lib/data";
    import type { Stint } from "$lib/data";
    import { scaleThreshold, scaleLinear, scalePoint } from "d3-scale";
    import { cls } from "@layerstack/tailwind";
    import {
        formatLapTime,
        formatDelta,
        compoundColor,
    } from "$lib/utils/format";

    const data = createDateSeries({
        count: 30,
        min: -50,
        max: 100,
        value: "integer",
    });

    const teamDomain = [...new Set(f1DataWithGap.map((d) => d.Team))];
    const teamRange = [
        ...new Map(f1DataWithGap.map((d) => [d.Team, d.Color])).values(),
    ];

    const sessions = ["FP2", "FP3", "Q1", "Q2", "Q", "R"];
    const sessionData = sessions.map((session, i) => {
        const row: Record<string, string | number> = { session };
        for (const result of results) {
            row[result.name] = result.ranks[i];
        }
        return row;
    });
    const maxRank = 22;
    const rowHeight = 20;
    const keys = results.map((r) => r.name);
    let hoveredState = $state<string | null>(null);

    const drivers = [...new Set(sessionData.map((d) => d.Driver))];

    // One "series" per compound type, with data pre-filtered
    const compounds = ["SOFT", "MEDIUM", "HARD"];

    const compoundColors: Record<string, string> = {
        SOFT: "#e8002d",
        MEDIUM: "#ffd700",
        HARD: "#c8c8c8",
    };

    const stintSeries = compounds.map((compound) => ({
        key: compound,
        label: compound,
        color: compoundColors[compound],
        data: stintData.filter((d) => d.Compound === compound),
        value: "StintLength",
    }));

    const numberOfLaps = 66;
    const lapsScale = scaleLinear([0, numberOfLaps]);
    const chartData = createStintChartData(stints as Stint[]);
    const raceDistance = getRaceDistance(chartData);
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
    data={f1DataWithGap}
    x="LapTimeDelta"
    y="Driver"
    c="Team"
    orientation="horizontal"
    cDomain={teamDomain}
    cRange={teamRange}
    props={{ xAxis: { format: formatDelta } }}
    padding={defaultChartPadding({ left: 50, right: 50 })}
    height={600}
>
    {#snippet tooltip({ context })}
        {@const data = context.tooltip.data}
        <Tooltip.Root>
            <Tooltip.Header value={data.Driver} />
            <Tooltip.List>
                <Tooltip.Item
                    label="Time"
                    value={formatLapTime(data.LapTime)}
                />
                <Tooltip.Item
                    label="Delta"
                    value={formatDelta(data.LapTimeDelta)}
                />
                <Tooltip.Item
                    label="Gap"
                    value={data.Gap === 0 ? "—" : formatDelta(data.Gap)}
                />
            </Tooltip.List>
        </Tooltip.Root>
    {/snippet}
</BarChart>

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

<BarChart
    data={chartData}
    x={["start", "end"]}
    y={(d) => d.Driver}
    c="Compound"
    cDomain={["SOFT", "MEDIUM", "HARD"]}
    cRange={["#da291c", "#ffd12e", "#f0f0ec"]}
    xBaseline={0}
    xNice={false}
    bandPadding={0.2}
    orientation="horizontal"
    height={500}
    props={{
        tooltip: {
            context: { mode: "bounds" },
        },
    }}
>
    {#snippet tooltip({ context })}
        {@const data = context.tooltip?.data}

        {#if data}
            <Tooltip.Root>
                <div class="space-y-1 min-w-[140px]">
                    <div class="font-bold">{data.Driver}</div>

                    <div class="flex items-center gap-2">
                        <span
                            class="w-2.5 h-2.5 rounded-full inline-block"
                            style="background-color: {compoundColors[
                                data.Compound
                            ]}"
                        />
                        <span>{data.Compound}</span>
                    </div>

                    <div class="opacity-80">
                        Laps: {data.start} → {data.end}
                    </div>

                    <div class="opacity-80">
                        Stint: {data.end - data.start} laps
                    </div>
                </div>
            </Tooltip.Root>
        {/if}
    {/snippet}
</BarChart>
