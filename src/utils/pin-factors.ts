/**
 * Pin position factors for the unipuck diagram.
 * top = size * factor.top rem, left = size * factor.left rem
 * Copied verbatim from astex-p2-crystal-registration crystalButtonPlacament.
 */
export const PIN_FACTORS: Record<number, { top: number; left: number }> = {
    1: { top: 0.235, left: 0.415 },
    2: { top: 0.358, left: 0.244 },
    3: { top: 0.555, left: 0.31 },
    4: { top: 0.553, left: 0.518 },
    5: { top: 0.355, left: 0.584 },
    6: { top: 0.025, left: 0.415 },
    7: { top: 0.093, left: 0.208 },
    8: { top: 0.253, left: 0.064 },
    9: { top: 0.468, left: 0.032 },
    10: { top: 0.66, left: 0.122 },
    11: { top: 0.775, left: 0.308 },
    12: { top: 0.778, left: 0.523 },
    13: { top: 0.663, left: 0.706 },
    14: { top: 0.463, left: 0.79 },
    15: { top: 0.251, left: 0.765 },
    16: { top: 0.093, left: 0.62 },
}
