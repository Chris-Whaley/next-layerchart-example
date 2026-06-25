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
    { name: 'LEC', ranks: [4, 3, 3, 2, 10, 22] },
    { name: 'ANT', ranks: [5, 7, 4, 3, 3, 22] },
    { name: 'BEA', ranks: [12, 17, 11, 15, 15, 22] },
    { name: 'ALB', ranks: [19, 18, 18, 18, 18, 22] },
    { name: 'ALO', ranks: [21, 20, 22, 22, 22, 22] },
    { name: 'HUL', ranks: [11, 9, 5, 10, 9, 22] },
    { name: 'BOT', ranks: [18, 21, 20, 20, 20, 22] },
    { name: 'STR', ranks: [22, 22, 21, 21, 21, 22] }
]

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
