<script lang="ts">
    import { curveBumpX } from "d3-shape";
    import {
        LineChart,
        defaultChartPadding,
        BarChart,
        BoxPlot,
        Chart,
        Axis,
        LinearGradient,
        Layer,
        Spline,
        Svg,
        Tooltip,
        Violin,
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
        positions,
        lapTimes,
        violinData,
        teamColors,
    } from "$lib/data";
    import type { Stint } from "$lib/data";
    import {
        scaleBand,
        scaleThreshold,
        scaleLinear,
        scalePoint,
    } from "d3-scale";
    import { quantile, min, max } from "d3-array";
    import { cls } from "@layerstack/tailwind";
    import {
        formatLapTime,
        formatDelta,
        compoundColor,
        rangeLoop,
        getStats,
    } from "$lib/utils/format";
    let isDark = $state(false);

    $effect(() => {
        isDark = document.documentElement.classList.contains("dark");
    });

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
    let hoveredQualifying = $state<string | null>(null);
    let hoveredRace = $state<string | null>(null);
    let hoveredStints = $state<string | null>(null);
    let hoveredSessions = $state<string | null>(null);

    const drivers = [...new Set(sessionData.map((d) => d.Driver))];

    // One "series" per compound type, with data pre-filtered
    const compounds = ["SOFT", "MEDIUM", "HARD"];

    const compoundColors: Record<string, string> = {
        SOFT: "#e8002d",
        MEDIUM: "#ffd700",
        HARD: "#f0f0ec",
    };

    const numberOfLaps = 66;
    const chartData = createStintChartData(stints as Stint[]);
    const raceDistance = getRaceDistance(chartData);

    const driverOrder = results
        .map((r) => ({
            name: r.name,
            finalRank: r.ranks[r.ranks.length - 1],
            totalLaps: stints
                .filter((s) => s.Driver === r.name)
                .reduce((sum, s) => sum + s.StintLength, 0),
        }))
        .sort((a, b) => a.finalRank - b.finalRank || b.totalLaps - a.totalLaps)
        .map((d) => d.name);

    let laps = rangeLoop(1, numberOfLaps);
    const lapData = laps.map((lap, i) => {
        const row: Record<string, string | number> = { lap };
        for (const driver of positions) {
            row[driver.Driver] = driver.Position[i] ?? driver.FinishPosition;
        }
        return row;
    });
    const driverResults = positions.map((d) => ({
        name: d.Driver,
        ranks: d.Position,
    }));
    const sortedViolinData = [...violinData].sort((a, b) => {
        const medianA = quantile(
            [...a.LapTimes].sort((x, y) => x - y),
            0.5,
        )!;
        const medianB = quantile(
            [...b.LapTimes].sort((x, y) => x - y),
            0.5,
        )!;
        return medianA - medianB;
    });
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

<h2>Qualifying Results</h2>
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

<h2>Session Results</h2>
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
                id="sessions-gradient-improved"
                stops={["var(--color-success-700)", "var(--color-success-300)"]}
            />
            <LinearGradient
                id="sessions-gradient-declined"
                stops={["var(--color-danger-300)", "var(--color-danger-700)"]}
            />

            <Axis placement="top" rule={false} />
            <Axis placement="bottom" rule={false} />

            <!-- Lines (one Spline per state) -->
            {#each results as result (result.name)}
                {@const dimmed =
                    hoveredSessions !== null && hoveredSessions !== result.name}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <g
                    onmouseenter={() => (hoveredSessions = result.name)}
                    onmouseleave={() => (hoveredSessions = null)}
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
                                ? "url(#sessions-gradient-improved)"
                                : from < to
                                  ? "url(#sessions-gradient-declined)"
                                  : "color-mix(in srgb, var(--color-surface-content) 30%, transparent)";
                        }}
                        strokeWidth={4}
                    />
                </g>
            {/each}

            <!-- Labels at each point -->
            {#each results as result (result.name)}
                {@const dimmed =
                    hoveredSessions !== null && hoveredSessions !== result.name}
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
                        onmouseenter={() => (hoveredSessions = result.name)}
                        onmouseleave={() => (hoveredSessions = null)}
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

<h2>Tire Stints</h2>
<BarChart
    data={chartData}
    x={["start", "end"]}
    y={(d) => d.Driver}
    yDomain={driverOrder}
    c="Compound"
    cDomain={["SOFT", "MEDIUM", "HARD"]}
    cRange={Object.values(compoundColors)}
    xBaseline={0}
    xNice={false}
    bandPadding={0.2}
    padding={defaultChartPadding({ left: 50, right: 50 })}
    orientation="horizontal"
    height={500}
    props={{
        tooltip: {
            context: { mode: "bounds" },
        },
        bars: { rounded: "none", strokeOpacity: 0 },
    }}
>
    {#snippet tooltip({ context })}
        {@const data = context.tooltip?.data}

        {#if data}
            {@const duration = data.end - data.start}
            {@const color = compoundColors[data.Compound]}
            <Tooltip.Root>
                <div class="space-y-1 min-w-[140px]">
                    <div class="font-bold">{data.Driver}</div>

                    <div
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border"
                        style="
                                background-color: {color}40;
                                border-color: {color};
                                color: {isDark
                            ? '#fff'
                            : data.Compound === 'HARD'
                              ? '#333'
                              : color};
                            "
                    >
                        {data.Compound}
                    </div>

                    <div class="opacity-80">
                        Lap {data.start}–{data.end}
                        <span class="opacity-80">({duration} laps)</span>
                    </div>
                </div>
            </Tooltip.Root>
        {/if}
    {/snippet}
</BarChart>

<h2>Race Position Changes</h2>
<Chart
    data={lapData}
    x="lap"
    xScale={scalePoint()}
    y={driverResults.map((r) => r.name)}
    yScale={scaleLinear()}
    yDomain={[maxRank + 0.5, 0.5]}
    padding={defaultChartPadding({ left: 50, right: 50 })}
    height={maxRank * rowHeight + 60}
>
    {#snippet children({ context })}
        <Layer>
            <LinearGradient
                id="race-gradient-improved"
                stops={["var(--color-success-700)", "var(--color-success-300)"]}
            />
            <LinearGradient
                id="race-gradient-declined"
                stops={["var(--color-danger-300)", "var(--color-danger-700)"]}
            />

            <Axis placement="top" rule={false} />
            <Axis placement="bottom" rule={false} />

            {#each driverResults as result (result.name)}
                {@const dimmed =
                    hoveredRace !== null && hoveredRace !== result.name}
                <g
                    onmouseenter={() => (hoveredRace = result.name)}
                    onmouseleave={() => (hoveredRace = null)}
                    class={cls(
                        "transition-opacity duration-200",
                        dimmed && "opacity-[0.15]",
                    )}
                >
                    <Spline
                        y={result.name}
                        curve={curveBumpX}
                        stroke={(d) => {
                            const arr = lapData;
                            const i = arr.findIndex((p) => p.lap === d.lap);
                            if (i >= arr.length - 1)
                                return "color-mix(in srgb, var(--color-surface-content) 30%, transparent)";
                            const from = d[result.name] as number;
                            const to = arr[i + 1][result.name] as number;
                            if (from == null || to == null)
                                return "color-mix(in srgb, var(--color-surface-content) 30%, transparent)";
                            return from > to
                                ? "url(#race-gradient-improved)"
                                : from < to
                                  ? "url(#race-gradient-declined)"
                                  : "color-mix(in srgb, var(--color-surface-content) 30%, transparent)";
                        }}
                        strokeWidth={4}
                    />
                </g>
            {/each}

            {#each driverResults as result (result.name)}
                {@const dimmed =
                    hoveredRace !== null && hoveredRace !== result.name}
                {@const validPoints = lapData.filter(
                    (p) => p[result.name] != null,
                )}
                {@const firstPoint = validPoints[0]}
                {@const lastPoint = validPoints[validPoints.length - 1]}

                {#each [firstPoint, lastPoint] as point, i}
                    {@const x = context.xScale(point.lap)}
                    {@const y = context.yScale(point[result.name])}
                    {@const lapIndex = lapData.indexOf(point)}
                    {@const from =
                        result.ranks[lapIndex === 0 ? 0 : lapIndex - 1]}
                    {@const to = result.ranks[lapIndex]}
                    {@const isFirst = i === 0}
                    <rect
                        x={x - 12}
                        y={y - rowHeight / 2}
                        width={24}
                        height={rowHeight}
                        class={cls(
                            "fill-surface-200 transition-opacity duration-200",
                            dimmed && "opacity-10",
                        )}
                        onmouseenter={() => (hoveredRace = result.name)}
                        onmouseleave={() => (hoveredRace = null)}
                    />
                    <text
                        {x}
                        {y}
                        text-anchor="middle"
                        dominant-baseline="central"
                        pointer-events="none"
                        class={cls(
                            "text-[12px] font-semibold font-[monospace] transition-opacity duration-200",
                            !isFirst && from > to
                                ? "fill-success"
                                : !isFirst && from < to
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

<h2>Lap Times per Driver</h2>
<Chart
    data={sortedViolinData}
    x="Driver"
    xScale={scaleBand().padding(0.4)}
    xDomain={sortedViolinData.map((d) => d.Driver)}
    y={(d) => d.LapTimes}
    yScale={scaleLinear()}
    yNice={true}
    padding={defaultChartPadding({ left: 50, right: 50 })}
    height={500}
    tooltipContext={{ mode: "bounds" }}
>
    <Layer>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" rule />
        {#each sortedViolinData as item}
            <Violin
                data={item}
                values="LapTimes"
                fill={teamColors[item.Team]}
                stroke={teamColors[item.Team]}
                strokeWidth={1.5}
                box
                median
            />
        {/each}
    </Layer>
    <Tooltip.Root>
        {#snippet children({ data })}
            {@const stats = getStats(data.LapTimes)}
            <Tooltip.Header value={`${data.Driver} · ${data.Team}`} />
            <Tooltip.List>
                <Tooltip.Item label="Max" value={formatLapTime(stats.max)} />
                <Tooltip.Item label="Q3" value={formatLapTime(stats.q3)} />
                <Tooltip.Item
                    label="Median"
                    value={formatLapTime(stats.median)}
                />
                <Tooltip.Item label="Q1" value={formatLapTime(stats.q1)} />
                <Tooltip.Item label="Min" value={formatLapTime(stats.min)} />
            </Tooltip.List>
        {/snippet}
    </Tooltip.Root>
</Chart>
