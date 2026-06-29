import { quantile, min, max } from "d3-array";

export const formatLapTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const mill = ms % 1000;
    return `${m}:${String(s).padStart(2, "0")}.${String(mill).padStart(3, "0")}`;
};

export const formatDelta = (ms: number) => {
    if (ms === 0) return "+0.000";
    const s = Math.floor(ms / 1000);
    const mill = ms % 1000;
    return `+${s}.${String(mill).padStart(3, "0")}`;
};

export function compoundColor(compound: string): string {
    return {
        SOFT: "#e8002d",
        MEDIUM: "#ffd700",
        HARD: "#c8c8c8",
    }[compound] ?? "#888";
}

export function rangeLoop(start: number, end: number) {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

export function getStats(times: number[]) {
    const sorted = [...times].sort((a, b) => a - b);
    return {
        min: min(sorted)!,
        q1: quantile(sorted, 0.25)!,
        median: quantile(sorted, 0.5)!,
        q3: quantile(sorted, 0.75)!,
        max: max(sorted)!,
    };
}