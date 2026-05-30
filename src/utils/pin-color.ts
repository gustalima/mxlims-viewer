import type { ResolvedPin } from '@/types/mxlims'
import { blue, green, grey } from '@mui/material/colors'

/** Returns the background colour for a pin dot based on occupancy. */
export function pinColor(pin: ResolvedPin | undefined): string {
    if (!pin) return grey[300]
    if (pin.sample) return green[400]
    return blue[200]
}
