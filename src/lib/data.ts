import { timeMinute, timeDay } from 'd3-time';
import { cumsum } from 'd3-array';
import { randomNormal } from 'd3-random';

import { degreesToRadians, radiansToDegrees } from 'layerchart';

/**
 * Get random number between min (inclusive) and max (exclusive)
 *   see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_0_inclusive_and_1_exclusive
 */
export function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * Get random integer between min (inclusive) and max (inclusive by default)
 *   see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
export function getRandomInteger(min: number, max: number, includeMax = true) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + (includeMax ? 1 : 0)) + min);
}

/**
 * @see: https://observablehq.com/@d3/d3-cumsum
 */
export function randomWalk(options?: { count?: number }) {
    const random = randomNormal();
    // @ts-expect-error shh
    return Array.from(cumsum({ length: options?.count ?? 100 }, random));
}

export function createSeries<TKey extends string>(options: {
    count?: number;
    min: number;
    max: number;
    keys?: TKey[];
    value?: 'number' | 'integer';
}) {
    const count = options.count ?? 10;
    const min = options.min;
    const max = options.max;
    const keys = options.keys ?? ['y'];

    return Array.from({ length: count }).map((_, i) => {
        return {
            x: options.value === 'integer' ? getRandomInteger(min, max) : getRandomNumber(min, max),
            ...Object.fromEntries(
                keys.map((key) => {
                    return [
                        key,
                        options.value === 'integer' ? getRandomInteger(min, max) : getRandomNumber(min, max)
                    ];
                })
            )
        } as { x: number } & { [K in TKey]: number };
    });
}

export function createDateSeries<TKey extends string>(
    options: {
        count?: number;
        min?: number;
        max?: number;
        keys?: TKey[];
        value?: 'number' | 'integer';
    } = {}
) {
    const now = timeDay.floor(new Date());

    const count = options.count ?? 10;
    const min = options.min ?? 0;
    const max = options.max ?? 100;
    const keys = options.keys ?? ['value'];
    const valueType = options.value ?? 'number';

    return Array.from({ length: count }).map((_, i) => {
        return {
            date: timeDay.offset(now, -count + i),
            ...Object.fromEntries(
                keys.map((key) => {
                    return [
                        key,
                        valueType === 'integer' ? getRandomInteger(min, max) : getRandomNumber(min, max)
                    ];
                })
            )
        } as { date: Date } & { [K in TKey]: number };
    });
}

export function createTimeSeries<TKey extends string>(
    options: {
        count?: number;
        min?: number;
        max?: number;
        keys?: TKey[];
        value?: 'number' | 'integer';
    } = {}
) {
    const count = options.count ?? 10;
    const min = options.min ?? 0;
    const max = options.max ?? 100;
    const keys = options.keys ?? ['value'];
    const valueType = options.value ?? 'number';

    let lastStartDate = timeDay.floor(new Date());

    const timeSeries = Array.from({ length: count }).map((_, i) => {
        const startDate = timeMinute.offset(lastStartDate, getRandomInteger(0, 60));
        const endDate = timeMinute.offset(startDate, getRandomInteger(5, 60));
        lastStartDate = startDate;
        return {
            name: `item ${i + 1}`,
            startDate,
            endDate,
            ...Object.fromEntries(
                keys.map((key) => {
                    return [
                        key,
                        valueType === 'integer' ? getRandomInteger(min, max) : getRandomNumber(min, max)
                    ];
                })
            )
        } as { name: string; startDate: Date; endDate: Date } & { [K in TKey]: number };
    });

    return timeSeries;
}

export const wideData = [
    { year: 2019, apples: 3840, bananas: 1920, cherries: 960, grapes: 400 },
    { year: 2018, apples: 1600, bananas: 1440, cherries: 960, grapes: 400 },
    { year: 2017, apples: 820, bananas: 1000, cherries: 640, grapes: 400 },
    { year: 2016, apples: 820, bananas: 560, cherries: 720, grapes: 400 }
];

export const usStateAbbreviations = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY'
];

export const longData = [
    { year: 2019, basket: 1, fruit: 'apples', value: 3840 },
    { year: 2019, basket: 1, fruit: 'bananas', value: 1920 },
    { year: 2019, basket: 2, fruit: 'cherries', value: 960 },
    { year: 2019, basket: 2, fruit: 'grapes', value: 400 },

    { year: 2018, basket: 1, fruit: 'apples', value: 1600 },
    { year: 2018, basket: 1, fruit: 'bananas', value: 1440 },
    { year: 2018, basket: 2, fruit: 'cherries', value: 960 },
    { year: 2018, basket: 2, fruit: 'grapes', value: 400 },

    { year: 2017, basket: 1, fruit: 'apples', value: 820 },
    { year: 2017, basket: 1, fruit: 'bananas', value: 1000 },
    { year: 2017, basket: 2, fruit: 'cherries', value: 640 },
    { year: 2017, basket: 2, fruit: 'grapes', value: 400 },

    { year: 2016, basket: 1, fruit: 'apples', value: 820 },
    { year: 2016, basket: 1, fruit: 'bananas', value: 560 },
    { year: 2016, basket: 2, fruit: 'cherries', value: 720 },
    { year: 2016, basket: 2, fruit: 'grapes', value: 400 }
];

export const f1Data = [
    { Driver: "RUS", LapTime: 74679, LapTimeDelta: 0, Team: "mercedes", Color: "#27f4d2" },
    { Driver: "HAM", LapTime: 74743, LapTimeDelta: 64, Team: "ferrari", Color: "#e80020" },
    { Driver: "ANT", LapTime: 74998, LapTimeDelta: 319, Team: "mercedes", Color: "#27f4d2" },
    { Driver: "NOR", LapTime: 75001, LapTimeDelta: 322, Team: "mcclaren", Color: "#ff8000" },
    { Driver: "VER", LapTime: 75021, LapTimeDelta: 342, Team: "redbull", Color: "#0600ef" },
    { Driver: "HAD", LapTime: 75077, LapTimeDelta: 398, Team: "redbull", Color: "#0600ef" },
    { Driver: "PIA", LapTime: 75090, LapTimeDelta: 411, Team: "mcclaren", Color: "#ff8000" },
    { Driver: "LEC", LapTime: 75281, LapTimeDelta: 602, Team: "ferrari", Color: "#e80020" },
    { Driver: "LAW", LapTime: 75585, LapTimeDelta: 906, Team: "racingbulls", Color: "#fcd700" },
    { Driver: "HUL", LapTime: 75768, LapTimeDelta: 1089, Team: "audi", Color: "#ff2d00" },
    { Driver: "LIN", LapTime: 75840, LapTimeDelta: 1161, Team: "racingbulls", Color: "#fcd700" },
    { Driver: "BOR", LapTime: 76001, LapTimeDelta: 1322, Team: "audi", Color: "#ff2d00" },
    { Driver: "COL", LapTime: 76191, LapTimeDelta: 1512, Team: "alpine", Color: "#ff87bc" },
    { Driver: "GAS", LapTime: 76261, LapTimeDelta: 1582, Team: "alpine", Color: "#ff87bc" },
    { Driver: "BEA", LapTime: 76389, LapTimeDelta: 1710, Team: "haas", Color: "#b6babd" },
    { Driver: "SAI", LapTime: 76881, LapTimeDelta: 2202, Team: "williams", Color: "#00a0dd" },
    { Driver: "OCO", LapTime: 77073, LapTimeDelta: 2394, Team: "haas", Color: "#b6babd" },
    { Driver: "ALB", LapTime: 77424, LapTimeDelta: 2745, Team: "williams", Color: "#00a0dd" },
    { Driver: "PER", LapTime: 77545, LapTimeDelta: 2866, Team: "cadillac", Color: "#444444" },
    { Driver: "BOT", LapTime: 77757, LapTimeDelta: 3078, Team: "cadillac", Color: "#444444" },
    { Driver: "STR", LapTime: 78758, LapTimeDelta: 4079, Team: "astonmartin", Color: "#00665f" },
    { Driver: "ALO", LapTime: 78815, LapTimeDelta: 4136, Team: "astonmartin", Color: "#00665f" }
]

export const f1DataWithGap = f1Data.map((d, i) => ({
    ...d,
    Gap: i === 0 ? 0 : d.LapTime - f1Data[i - 1].LapTime
}));

export const results = [
    { name: 'HAM', ranks: [9, 5, 1, 5, 2, 1] },
    { name: 'RUS', ranks: [2, 2, 2, 1, 1, 2] },
    { name: 'NOR', ranks: [1, 4, 7, 4, 4, 3] },
    { name: 'VER', ranks: [6, 6, 8, 6, 5, 4] },
    { name: 'PIA', ranks: [3, 2, 6, 7, 7, 5] },
    { name: 'HAD', ranks: [10, 8, 10, 9, 6, 6] },
    { name: 'GAS', ranks: [16, 13, 13, 14, 14, 7] },
    { name: 'LAW', ranks: [13, 12, 15, 8, 8, 8] },
    { name: 'LIN', ranks: [7, 10, 9, 11, 11, 9] },
    { name: 'COL', ranks: [15, 14, 12, 13, 13, 10] },
    { name: 'BOR', ranks: [8, 11, 14, 12, 12, 11] },
    { name: 'SAI', ranks: [14, 15, 16, 16, 16, 12] },
    { name: 'OCO', ranks: [17, 16, 17, 17, 17, 13] },
    { name: 'PER', ranks: [20, 19, 19, 19, 19, 14] },
    { name: 'LEC', ranks: [4, 3, 3, 2, 10, 15] },
    { name: 'ANT', ranks: [5, 7, 4, 3, 3, 16] },
    { name: 'BEA', ranks: [12, 17, 11, 15, 15, 17] },
    { name: 'ALB', ranks: [19, 18, 18, 18, 18, 18] },
    { name: 'ALO', ranks: [21, 20, 22, 22, 22, 19] },
    { name: 'HUL', ranks: [11, 9, 5, 10, 9, 20] },
    { name: 'BOT', ranks: [18, 21, 20, 20, 20, 21] },
    { name: 'STR', ranks: [22, 22, 21, 21, 21, 22] }
]

export const stints = [{ "Driver": "ALB", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 13 }, { "Driver": "ALB", "Stint": 2.0, "Compound": "HARD", "StintLength": 16 }, { "Driver": "ALB", "Stint": 3.0, "Compound": "HARD", "StintLength": 5 }, { "Driver": "ALB", "Stint": 4.0, "Compound": "SOFT", "StintLength": 16 }, { "Driver": "ALB", "Stint": 5.0, "Compound": "SOFT", "StintLength": 5 }, { "Driver": "ALO", "Stint": 1.0, "Compound": "HARD", "StintLength": 21 }, { "Driver": "ALO", "Stint": 2.0, "Compound": "HARD", "StintLength": 17 }, { "Driver": "ANT", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 14 }, { "Driver": "ANT", "Stint": 2.0, "Compound": "HARD", "StintLength": 23 }, { "Driver": "ANT", "Stint": 3.0, "Compound": "HARD", "StintLength": 25 }, { "Driver": "BEA", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 18 }, { "Driver": "BEA", "Stint": 2.0, "Compound": "HARD", "StintLength": 21 }, { "Driver": "BEA", "Stint": 3.0, "Compound": "SOFT", "StintLength": 21 }, { "Driver": "BOR", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 15 }, { "Driver": "BOR", "Stint": 2.0, "Compound": "HARD", "StintLength": 18 }, { "Driver": "BOR", "Stint": 3.0, "Compound": "HARD", "StintLength": 20 }, { "Driver": "BOR", "Stint": 4.0, "Compound": "SOFT", "StintLength": 11 }, { "Driver": "BOT", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 14 }, { "Driver": "BOT", "Stint": 2.0, "Compound": "HARD", "StintLength": 1 }, { "Driver": "COL", "Stint": 1.0, "Compound": "SOFT", "StintLength": 12 }, { "Driver": "COL", "Stint": 2.0, "Compound": "HARD", "StintLength": 22 }, { "Driver": "COL", "Stint": 3.0, "Compound": "HARD", "StintLength": 31 }, { "Driver": "GAS", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 14 }, { "Driver": "GAS", "Stint": 2.0, "Compound": "HARD", "StintLength": 26 }, { "Driver": "GAS", "Stint": 3.0, "Compound": "HARD", "StintLength": 25 }, { "Driver": "HAD", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 15 }, { "Driver": "HAD", "Stint": 2.0, "Compound": "HARD", "StintLength": 17 }, { "Driver": "HAD", "Stint": 3.0, "Compound": "HARD", "StintLength": 26 }, { "Driver": "HAD", "Stint": 4.0, "Compound": "SOFT", "StintLength": 7 }, { "Driver": "HAM", "Stint": 1.0, "Compound": "SOFT", "StintLength": 11 }, { "Driver": "HAM", "Stint": 2.0, "Compound": "HARD", "StintLength": 16 }, { "Driver": "HAM", "Stint": 3.0, "Compound": "MEDIUM", "StintLength": 14 }, { "Driver": "HAM", "Stint": 4.0, "Compound": "HARD", "StintLength": 25 }, { "Driver": "HUL", "Stint": 1.0, "Compound": "SOFT", "StintLength": 13 }, { "Driver": "HUL", "Stint": 2.0, "Compound": "HARD", "StintLength": 16 }, { "Driver": "LAW", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 11 }, { "Driver": "LAW", "Stint": 2.0, "Compound": "HARD", "StintLength": 24 }, { "Driver": "LAW", "Stint": 3.0, "Compound": "HARD", "StintLength": 30 }, { "Driver": "LEC", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 16 }, { "Driver": "LEC", "Stint": 2.0, "Compound": "HARD", "StintLength": 23 }, { "Driver": "LEC", "Stint": 3.0, "Compound": "HARD", "StintLength": 23 }, { "Driver": "LIN", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 22 }, { "Driver": "LIN", "Stint": 2.0, "Compound": "HARD", "StintLength": 15 }, { "Driver": "LIN", "Stint": 3.0, "Compound": "HARD", "StintLength": 28 }, { "Driver": "NOR", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 13 }, { "Driver": "NOR", "Stint": 2.0, "Compound": "HARD", "StintLength": 22 }, { "Driver": "NOR", "Stint": 3.0, "Compound": "HARD", "StintLength": 31 }, { "Driver": "OCO", "Stint": 1.0, "Compound": "SOFT", "StintLength": 13 }, { "Driver": "OCO", "Stint": 2.0, "Compound": "HARD", "StintLength": 21 }, { "Driver": "OCO", "Stint": 3.0, "Compound": "MEDIUM", "StintLength": 24 }, { "Driver": "OCO", "Stint": 4.0, "Compound": "SOFT", "StintLength": 6 }, { "Driver": "PER", "Stint": 1.0, "Compound": "SOFT", "StintLength": 12 }, { "Driver": "PER", "Stint": 2.0, "Compound": "HARD", "StintLength": 19 }, { "Driver": "PER", "Stint": 3.0, "Compound": "HARD", "StintLength": 8 }, { "Driver": "PER", "Stint": 4.0, "Compound": "MEDIUM", "StintLength": 24 }, { "Driver": "PIA", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 14 }, { "Driver": "PIA", "Stint": 2.0, "Compound": "HARD", "StintLength": 22 }, { "Driver": "PIA", "Stint": 3.0, "Compound": "HARD", "StintLength": 30 }, { "Driver": "RUS", "Stint": 1.0, "Compound": "MEDIUM", "StintLength": 12 }, { "Driver": "RUS", "Stint": 2.0, "Compound": "HARD", "StintLength": 24 }, { "Driver": "RUS", "Stint": 3.0, "Compound": "HARD", "StintLength": 30 }, { "Driver": "SAI", "Stint": 1.0, "Compound": "SOFT", "StintLength": 14 }, { "Driver": "SAI", "Stint": 2.0, "Compound": "HARD", "StintLength": 16 }, { "Driver": "SAI", "Stint": 3.0, "Compound": "HARD", "StintLength": 25 }, { "Driver": "SAI", "Stint": 4.0, "Compound": "MEDIUM", "StintLength": 9 }, { "Driver": "STR", "Stint": 1.0, "Compound": "HARD", "StintLength": 5 }, { "Driver": "VER", "Stint": 1.0, "Compound": "SOFT", "StintLength": 12 }, { "Driver": "VER", "Stint": 2.0, "Compound": "MEDIUM", "StintLength": 17 }, { "Driver": "VER", "Stint": 3.0, "Compound": "HARD", "StintLength": 11 }, { "Driver": "VER", "Stint": 4.0, "Compound": "MEDIUM", "StintLength": 26 }]

// In $lib/data.ts
export const stintData = (() => {
    const result: { Driver: string; Stint: number; Compound: string; StintLength: number; Start: number }[] = [];
    const drivers = [...new Set(stints.map(d => d.Driver))];
    for (const driver of drivers) {
        let offset = 0;
        for (const row of stints.filter(d => d.Driver === driver)) {
            result.push({ ...row, Start: offset });
            offset += row.StintLength;
        }
    }
    return result;
})();

// chatgpt
// chartData.ts

export interface Stint {
    Driver: string;
    Stint: number;
    Compound: string;
    StintLength: number;
}

export interface ChartStint {
    driver: string;
    stint: number;
    compound: string;
    length: number;
    start: number;
    end: number;
}

export function createStintChartData(stints: Stint[]): ChartStint[] {
    const chartData: ChartStint[] = [];

    const grouped = Object.groupBy(stints, d => d.Driver);

    for (const [driver, driverStints] of Object.entries(grouped)) {
        if (!driverStints) continue;

        let start = 0;

        driverStints
            .toSorted((a, b) => a.Stint - b.Stint)
            .forEach((stint) => {
                const end = start + stint.StintLength;

                chartData.push({
                    Driver: driver,
                    Stint: stint.Stint,
                    Compound: stint.Compound,
                    start,
                    end
                });

                start = end;
            });
    }

    return chartData;
}
export function getDrivers(stints: Stint[]) {
    return [...new Set(stints.map(d => d.Driver))];
}

export function getRaceDistance(chartData: ChartStint[]) {
    return Math.max(...chartData.map(d => d.end));
}

export const positions = [{ "Driver": "ALB", "Position": [18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 17.0, 16.0, 20.0, 19.0, 18.0, 19.0, 19.0, 17.0, 17.0, 17.0, 17.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 17.0, 17.0, 17.0, 19.0, 19.0, 19.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0, 18.0], "Finish": 18.0 }, { "Driver": "ALO", "Position": [22.0, 22.0, 22.0, 22.0, 21.0, 21.0, 21.0, 21.0, 21.0, 21.0, 21.0, 20.0, 19.0, 17.0, 16.0, 17.0, 17.0, 18.0, 18.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 19.0, 19.0, 18.0, 18.0, 18.0, 17.0, 17.0, 17.0, null], "Finish": 19.0 }, { "Driver": "ANT", "Position": [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 1.0, 1.0, 4.0, 4.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 1.0, 1.0, 4.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 2.0, null], "Finish": 16.0 }, { "Driver": "BEA", "Position": [15.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 15.0, 13.0, 12.0, 10.0, 9.0, 10.0, 14.0, 20.0, 18.0, 18.0, 18.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 15.0, 14.0, 14.0, 13.0, 13.0, 13.0, 13.0, 13.0, 12.0, 12.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 13.0, 13.0, 13.0, 13.0, 13.0, 15.0], "Finish": 17.0 }, { "Driver": "BOR", "Position": [17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 16.0, 14.0, 13.0, 12.0, 19.0, 18.0, 17.0, 16.0, 16.0, 16.0, 16.0, 15.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 12.0, 13.0, 13.0, 14.0, 16.0, 15.0, 15.0, 15.0, 15.0, 15.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 16.0, 16.0, 14.0, 14.0, 14.0, 14.0, 13.0, 13.0, 12.0, 11.0, 11.0], "Finish": 11.0 }, { "Driver": "BOT", "Position": [20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 21.0, 20.0, 19.0, 21.0], "Finish": 21.0 }, { "Driver": "COL", "Position": [11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 18.0, 16.0, 14.0, 13.0, 13.0, 12.0, 13.0, 13.0, 13.0, 13.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 12.0, 11.0, 11.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 9.0, 8.0, 8.0, 8.0], "Finish": 10.0 }, { "Driver": "GAS", "Position": [12.0, 12.0, 12.0, 12.0, 12.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 11.0, 11.0, 10.0, 15.0, 14.0, 14.0, 13.0, 12.0, 12.0, 12.0, 12.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 7.0, 7.0, 7.0], "Finish": 7.0 }, { "Driver": "HAD", "Position": [14.0, 14.0, 13.0, 13.0, 13.0, 12.0, 11.0, 11.0, 11.0, 10.0, 9.0, 9.0, 7.0, 8.0, 7.0, 11.0, 9.0, 9.0, 9.0, 9.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 7.0, 6.0, 6.0, 6.0], "Finish": 6.0 }, { "Driver": "HAM", "Position": [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 4.0, 7.0, 6.0, 5.0, 3.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 4.0, 7.0, 6.0, 5.0, 5.0, 4.0, 4.0, 4.0, 3.0, 3.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], "Finish": 1.0 }, { "Driver": "HUL", "Position": [10.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 8.0, 8.0, 9.0, 15.0, 13.0, 12.0, 12.0, 11.0, 11.0, 11.0, 11.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 12.0], "Finish": 20.0 }, { "Driver": "LAW", "Position": [8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 10.0, 18.0, 17.0, 14.0, 11.0, 10.0, 11.0, 10.0, 10.0, 10.0, 10.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 10.0, 12.0, 12.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 10.0, 9.0, 9.0, 9.0], "Finish": 8.0 }, { "Driver": "LEC", "Position": [7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 4.0, 3.0, 2.0, 1.0, 2.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 5.0, 4.0, 4.0, 4.0, 5.0, 5.0, 5.0, 5.0, 4.0, 3.0, 2.0, 5.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0], "Finish": 15.0 }, { "Driver": "LIN", "Position": [9.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 11.0, 11.0, 10.0, 10.0, 9.0, 9.0, 8.0, 8.0, 8.0, 8.0, 8.0, 9.0, 11.0, 16.0, 16.0, 16.0, 15.0, 15.0, 15.0, 15.0, 13.0, 12.0, 12.0, 12.0, 12.0, 11.0, 10.0, 10.0, 14.0, 14.0, 13.0, 13.0, 13.0, 13.0, 13.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 12.0, 11.0, 10.0, 10.0, 10.0], "Finish": 9.0 }, { "Driver": "NOR", "Position": [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 3.0, 3.0, 2.0, 6.0, 5.0, 5.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 4.0, 5.0, 5.0, 5.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 3.0, 3.0, 3.0, 3.0, 3.0], "Finish": 3.0 }, { "Driver": "OCO", "Position": [16.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 14.0, 15.0, 18.0, 18.0, 16.0, 16.0, 16.0, 15.0, 15.0, 15.0, 15.0, 14.0, 15.0, 15.0, 16.0, 16.0, 16.0, 16.0, 16.0, 15.0, 15.0, 15.0, 15.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 16.0, 15.0, 15.0, 15.0, 16.0, 16.0, 16.0, 16.0, 15.0, 14.0, 13.0, 13.0], "Finish": 13.0 }, { "Driver": "PER", "Position": [19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 21.0, 21.0, 20.0, 20.0, 20.0, 20.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 17.0, 17.0, 19.0, 19.0, 19.0, 18.0, 18.0, 18.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 16.0, 15.0, 14.0], "Finish": 14.0 }, { "Driver": "PIA", "Position": [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 7.0, 7.0, 7.0, 7.0, 5.0, 4.0, 4.0, 8.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 5.0, 5.0, 5.0, 5.0, 5.0], "Finish": 5.0 }, { "Driver": "RUS", "Position": [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 5.0, 3.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 4.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0], "Finish": 2.0 }, { "Driver": "SAI", "Position": [13.0, 13.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 13.0, 12.0, 11.0, 17.0, 15.0, 15.0, 15.0, 14.0, 14.0, 14.0, 14.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 14.0, 16.0, 16.0, 16.0, 14.0, 14.0, 14.0, 14.0, 13.0, 13.0, 12.0, 12.0, 12.0, 12.0, 12.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 13.0, 14.0, 16.0, 15.0, 15.0, 15.0, 14.0, 14.0, 13.0, 12.0, 12.0], "Finish": 12.0 }, { "Driver": "STR", "Position": [21.0, 21.0, 21.0, 21.0, 22.0], "Finish": 22.0 }, { "Driver": "VER", "Position": [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 6.0, 8.0, 7.0, 6.0, 6.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 4.0, 5.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 4.0, 4.0, 4.0, 4.0, 4.0], "Finish": 4.0 }]
export function getPhyllotaxis({
    radius,
    count,
    width,
    height
}: {
    radius: number;
    count: number;
    width: number;
    height: number;
}) {
    // Phyllotaxis: https://www.youtube.com/watch?v=KWoJgHFYWxY
    const rads = Math.PI * (3 - Math.sqrt(5)); // ~2.4 rads or ~137.5 degrees
    return getSpiral({ angle: radiansToDegrees(rads), radius, count, width, height });
}

export function getSpiral({
    angle,
    radius,
    count,
    width,
    height
}: {
    angle: number;
    radius: number;
    count: number;
    width: number;
    height: number;
}) {
    return Array.from({ length: count }, (_, i) => {
        const r = radius * Math.sqrt(i);
        const a = degreesToRadians(angle * i);
        return {
            x: width / 2 + r * Math.cos(a),
            y: height / 2 + r * Math.sin(a)
        };
    });
}

interface SineWaveOptions {
    numPoints: number;
    frequency?: number;
    amplitude?: number;
    noiseLevel?: number;
    phase?: number;
    xMin?: number;
    xMax?: number;
}

export function generateSineWave(options: SineWaveOptions) {
    const {
        numPoints,
        frequency = 1,
        amplitude = 1,
        noiseLevel = 0,
        phase = 0,
        xMin = 0,
        xMax = 2 * Math.PI
    } = options;

    if (numPoints <= 0) {
        throw new Error('Number of points must be greater than 0');
    }

    const points: { x: number; y: number }[] = [];
    const xStep = (xMax - xMin) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * xStep;

        // Generate base sine wave
        const sineValue = amplitude * Math.sin(frequency * x + phase);

        // Add random noise if specified
        const noise = noiseLevel > 0 ? (Math.random() - 0.5) * 2 * noiseLevel : 0;
        const y = sineValue + noise;

        points.push({ x, y });
    }

    return points;
}


// Unique teams for color scale
export const teamColors: Record<string, string> = {
    "Alpine": "#ff87bc",
    "Aston Martin": "#00665f",
    "Audi": "#ff2d00",
    "Cadillac": "#444444",
    "Ferrari": "#e80020",
    "Mercedes": "#27f4d2",
    "Haas F1 Team": "#b6babd",
    "McLaren": "#ff8000",
    "Red Bull Racing": "#0600ef",
    "Racing Bulls": "#fcd700",
    "Williams": "#00a0dd",
};

export const lapTimes = [{ "Driver": "ALB", "Team": "Williams", "LapTime": [94507, 85305, 85324, 85320, 85707, 85680, 86108, 86438, 86588, 86564, 86477, 86569, 90373, 106180, 84482, 84973, 85538, 84969, 85022, 85443, 85217, 85301, 85909, 87824, 88019, 85213, 85467, 88197, 90544, 105271, 84343, 83803, 84379, 87738, null, 83151, 83195, 83194, 83287, 83573, 83410, 83602, 86038, 83690, 83638, 85518, 84152, 83850, 84407, 88162, 111750, 107395, 105482, 81744, 83588] }, { "Driver": "ALO", "Team": "Aston Martin", "LapTime": [97171, 85751, 86254, 86079, 86728, 86279, 86333, 86644, 87479, 88460, 87477, 87381, 87620, 87565, 87301, 87842, 86881, 87408, 87901, 88393, 93829, 105173, 85437, 85761, 85958, 85691, 85366, 86416, 85803, 85827, 85788, 85851, 85945, 86215, 86945, 86063, 86259, null] }, { "Driver": "ANT", "Team": "Mercedes", "LapTime": [86497, 82042, 82120, 82271, 82448, 82992, 83088, 83757, 83560, 83882, 83586, 83367, 83560, 87034, 100870, 82003, 81905, 81632, 81921, 82049, 82196, 82161, 82450, 82843, 82677, 82614, 82760, 82055, 82623, 82502, 82839, 82688, 83757, 82717, 82661, 83424, 85693, 100095, 80899, 88148, 106236, 85786, 80898, 80917, 80717, 80704, 80867, 81328, 81229, 81361, 81358, 81450, 81909, 81736, 81853, 81768, 81927, 81870, 82091, 81803, 82715, null] }, { "Driver": "BEA", "Team": "Haas F1 Team", "LapTime": [93669, 85184, 84941, 85086, 85215, 85592, 86101, 86127, 86321, 86505, 86654, 86607, 86753, 85933, 85544, 86485, 86707, 91200, 104483, 85204, 83939, 84285, 83746, 84052, 85907, 86829, 85807, 84161, 84350, 83789, 84356, 85245, 84430, 84255, 86581, 85902, 86474, 86381, 96309, 121385, 82484, 82657, 82419, 82833, 82897, 83241, 83829, 84192, 83926, 84194, 83951, 84129, 84514, 84565, 84642, 87738, 84737, 84379, 84106, 103521] }, { "Driver": "BOR", "Team": "Audi", "LapTime": [94169, 85022, 85078, 85113, 85442, 85548, 86224, 86347, 86301, 86426, 86600, 86792, 86799, 86526, 89806, 104821, 83470, 83923, 83551, 84068, 83836, 83914, 84725, 84069, 84199, 84917, 84594, 85180, 85753, 87066, 87453, 85977, 89825, 103826, 83639, 83784, 83566, 84176, 97964, 104104, 82925, 84641, 82559, 82815, 83219, 83617, 84190, 85522, 84586, 84157, 83978, 84094, 88318, 105439, 81446, 82781, 81530, 82191, 82545, 83029, 110025, 107509, 87099, 81984] }, { "Driver": "BOT", "Team": "Cadillac", "LapTime": [95407, 86038, 85745, 86254, 86543, 86660, 86681, 87170, 87746, 87968, 88045, 89432, 88393, 92208, 120780] }, { "Driver": "COL", "Team": "Alpine", "LapTime": [91450, 84260, 84360, 84397, 84909, 84948, 86439, 85561, 86184, 86102, 85710, 89443, 104099, 83746, 83766, 84335, 84333, 84065, 85623, 84417, 84097, 84176, 84469, 85027, 84908, 84961, 84492, 84582, 84374, 84336, 84641, 84743, 85632, 88651, 102632, 83197, 83540, 85911, 90454, 106371, 86845, 82652, 82449, 82509, 82682, 83113, 83321, 83804, 86127, 83737, 83535, 83784, 85140, 83870, 83930, 83686, 83489, 83571, 83639, 84007, 100235, 105758, 98332, 84152, 84264] }, { "Driver": "GAS", "Team": "Alpine", "LapTime": [92099, 84303, 84219, 84527, 85097, 85808, 85386, 85720, 86054, 86055, 85954, 85806, 85798, 89745, 102799, 83023, 83237, 83512, 83619, 83826, 83789, 83988, 84096, 85127, 84606, 84652, 85125, 85143, 84775, 84587, 84734, 84877, 85359, 85113, 85068, 84317, 85105, 86733, 88674, 108520, 103400, 81708, 81960, 82014, 82691, 82562, 83116, 82790, 82992, 83112, 83192, 84548, 84997, 83426, 83374, 83027, 83006, 83133, 83182, 83292, 94255, 107450, 102785, 83285, 83622] }, { "Driver": "HAD", "Team": "Red Bull Racing", "LapTime": [93015, 84536, 83843, 84407, 84798, 84499, 84577, 85342, 85914, 84509, 84531, 85087, 85071, 85294, 88080, 102237, 82786, 81835, 82223, 83578, 82920, 82778, 82951, 82994, 83272, 83259, 83282, 83703, 83758, 84178, 84568, 87725, 101002, 81140, 81996, 82229, 82139, 82099, 82056, 103056, 97117, 82585, 82182, 82316, 82312, 82426, 82544, 82002, 82477, 82354, 82652, 83064, 82819, 82972, 83002, 84062, 84882, 87778, 100329, 80150, 84651, 108329, 107828, 83518, 81114] }, { "Driver": "HAM", "Team": "Ferrari", "LapTime": [85639, 81710, 82070, 82579, 82302, 82890, 82937, 83351, 83462, 83576, 87828, 100800, 81433, 82075, 81911, 82151, 82001, 82165, 82464, 82618, 82728, 82891, 82926, 82889, 83265, 83331, 87024, 99857, 80633, 80910, 80725, 80855, 81077, 80954, 81151, 81227, 80979, 81360, 81859, 81679, 110885, 101055, 80314, 80122, 80129, 80369, 80182, 80313, 80880, 80293, 80987, 80771, 81266, 80980, 81064, 81083, 81413, 81502, 81111, 81170, 81406, 81374, 103064, 107326, 92659, 82105] }, { "Driver": "HUL", "Team": "Audi", "LapTime": [90923, 83447, 84000, 83806, 84387, 85236, 85328, 85106, 85099, 85451, 85387, 85745, 89911, 104738, 84779, 84126, 84467, 84879, 83954, 84238, 84071, 84026, 84338, 85260, 84607, 84672, 84773, 85105, 95736] }, { "Driver": "LAW", "Team": "Racing Bulls", "LapTime": [90071, 83785, 83740, 83868, 84374, 85203, 84783, 85309, 85185, 85289, 89068, 106877, 84085, 84870, 84567, 84406, 85193, 85328, 84025, 84070, 84077, 84326, 84449, 85030, 84495, 84941, 84682, 84888, 84901, 85033, 85103, 85134, 85270, 85306, 89233, 103904, 86413, 83223, 90459, 107158, 87148, 82964, 82829, 82886, 82691, 82708, 85417, 83166, 83428, 83455, 85233, 83668, 83447, 83643, 84251, 83904, 83666, 83586, 83527, 83625, 100559, 106592, 97267, 83887, 84661] }, { "Driver": "LEC", "Team": "Ferrari", "LapTime": [89361, 82883, 82650, 82914, 83063, 83835, 83102, 83402, 83561, 83800, 84178, 84300, 83510, 83996, 84039, 87915, 101974, 82198, 81985, 81753, 81589, 82011, 81864, 82463, 82600, 82735, 83196, 83068, 83124, 82705, 82853, 84187, 83328, 82962, 83040, 82768, 83024, 83515, 88314, 114194, 104778, 80627, 80999, 80740, 80881, 80458, 80379, 81017, 80884, 82376, 81681, 82154, 81875, 82010, 82015, 82768, 82450, 82265, 82196, 83072, 82855, 125258] }, { "Driver": "LIN", "Team": "Racing Bulls", "LapTime": [90602, 84617, 84071, 84305, 84576, 85414, 85526, 85468, 85793, 86713, 85886, 85815, 86384, 85686, 86468, 85745, 85507, 85512, 85813, 86116, 87217, 90108, 104347, 83442, 84875, 83586, 83707, 84491, 88373, 84523, 84347, 85958, 84264, 85835, 84255, 83839, 87334, 104033, 94447, 105558, 84998, 82685, 84130, 82665, 81914, 82299, 82528, 82441, 83003, 83068, 83112, 82969, 82941, 83173, 83922, 83861, 83615, 83555, 83687, 83913, 100132, 107572, 97018, 83373, 83049] }, { "Driver": "NOR", "Team": "McLaren", "LapTime": [87198, 82251, 82422, 82773, 83287, 83226, 83357, 83392, 83501, 83319, 83401, 83618, 87846, 100651, 82070, 82193, 81944, 81981, 82354, 82243, 82375, 82022, 82279, 82444, 82463, 82664, 82909, 82660, 83254, 83156, 82947, 83597, 82849, 83115, 87299, 99962, 80232, 81112, 81165, 88389, 106938, 85074, 80931, 80806, 80928, 80830, 80948, 81200, 81262, 80962, 81253, 81606, 81811, 81809, 81964, 82127, 82223, 82252, 82489, 82400, 83142, 82724, 109473, 108341, 86010, 82401] }, { "Driver": "OCO", "Team": "Haas F1 Team", "LapTime": [93891, 84454, 84984, 84865, 85153, 85635, 85854, 85775, 86339, 86661, 86644, 86773, 91048, 104509, 84131, 84675, 84219, 84304, 84508, 84786, 84765, 84981, 85125, 86361, 85332, 86423, 86674, 87143, 86676, 86566, 86811, 87222, 85892, 91087, 106543, 83109, 83252, 83402, 101185, 99739, 83215, 83222, 83055, 83657, 83665, 85350, 83921, 83923, 83819, 84442, 84641, 85710, 84940, 84879, 88386, 85499, 86256, 90415, 102395, 96231, 107338, 100045, 81643, 83111] }, { "Driver": "PER", "Team": "Cadillac", "LapTime": [94895, 85549, 85378, 85701, 85768, 86016, 86090, 86482, 86902, 86728, 86990, 91348, 106469, 84676, 84220, 85422, 85119, 85018, 86249, 86336, 85511, 87003, 87873, 86632, 86239, 88608, 86984, 87363, 86456, 86699, 91808, 105237, 83599, 85288, 84306, 84883, 85828, 84717, 112623, 106284, 83881, 86375, 82820, 85346, 83442, 83799, 83796, 85740, 87241, 88083, 84906, 84708, 84895, 85083, 87104, 85397, 85495, 85942, 86844, 106959, 108258, 89685, 84778] }, { "Driver": "PIA", "Team": "McLaren", "LapTime": [88570, 82673, 82940, 83054, 83242, 83298, 83569, 85507, 84548, 84401, 84097, 84117, 83999, 88542, 102741, 82541, 82229, 82269, 82262, 82449, 82858, 82937, 82898, 82907, 83038, 82771, 82851, 83283, 83674, 83608, 83345, 83833, 83000, 83037, 83444, 86917, 102367, 82113, 82073, 96647, 102962, 81086, 80974, 81203, 80939, 80835, 80994, 81299, 81147, 82849, 81904, 82366, 82042, 82292, 82369, 82139, 82169, 82723, 83228, 82546, 82671, 96112, 108012, 100758, 83332, 83166] }, { "Driver": "RUS", "Team": "Mercedes", "LapTime": [84418, 81513, 81479, 82044, 82427, 82473, 82687, 83253, 83198, 83510, 83701, 87454, 100974, 81790, 81972, 82161, 81766, 82103, 82446, 82513, 82556, 82725, 83254, 82803, 83026, 82908, 83144, 83176, 83208, 83647, 83325, 82884, 83437, 82649, 82921, 87737, 99632, 80709, 81179, 88216, 106112, 86031, 80640, 80821, 80740, 80739, 80933, 81267, 81322, 81522, 81628, 81652, 81864, 81459, 81529, 82070, 82072, 81946, 82271, 82186, 84562, 82480, 107549, 107804, 87127, 82322] }, { "Driver": "SAI", "Team": "Williams", "LapTime": [92484, 84786, 85319, 84723, 84999, 85278, 85568, 85756, 86116, 86141, 86396, 86335, 86280, 89888, 104877, 84098, 84437, 84198, 84261, 84410, 84599, 84847, 84723, 85043, 85020, 85483, 85102, 85724, 85353, 88745, 105059, 83619, 83969, 84493, 86235, 83949, 83996, 84183, 94947, 105348, 83898, 85678, 83482, 84720, 84968, 83956, 83703, 83730, 84218, 84218, 84078, 84526, 84493, 84581, 89059, 103794, 82280, 82061, 82255, 87570, 107064, 107595, 84807, 82450] }, { "Driver": "STR", "Team": "Aston Martin", "LapTime": [96077, 86301, 85904, 86430, 94345] }, { "Driver": "VER", "Team": "Red Bull Racing", "LapTime": [87920, 82628, 82734, 82998, 83029, 83413, 83343, 83663, 83969, 84313, 84177, 88494, 101097, 81904, 81917, 82198, 82320, 82487, 82523, 82870, 82877, 82821, 82807, 82811, 83054, 83212, 83483, 83309, 87242, 102514, 81222, 81720, 81545, 81829, 81774, 82121, 81884, 81920, 82098, 92671, 120780, 80230, 80534, 80691, 80781, 80467, 80850, 80978, 81104, 81793, 81284, 81474, 81252, 81509, 81551, 81612, 81505, 81895, 82069, 82521, 82511, 88107, 109582, 105613, 83474, 83524] }]

export const violinData = lapTimes.map((d) => ({
    Driver: d.Driver,
    Team: d.Team,
    LapTimes: d.LapTime.filter((t): t is number => t !== null),
}));

