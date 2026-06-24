<script lang="ts">
    import { LineChart } from "layerchart";
    import { createDateSeries } from "$lib/data";

    const data = createDateSeries({
        count: 30,
        min: 50,
        max: 100,
        value: "integer",
    });
</script>

<h1>Welcome to My Project</h1>

<LineChart {data} x="date" y="value" height={300} />
