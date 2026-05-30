import { Box, Tooltip, Typography } from '@mui/material'
import { blue, green, grey } from '@mui/material/colors'
import { darken } from '@mui/material/styles'
import React from 'react'
import type { ResolvedPin } from '../types/mxlims'

// ── Exact factors from astex-p2-crystal-registration ──────────────────────────
// crystalButtonPlacament: top = size * factor rem, left = size * factor rem
// crystalButtonSize: width = height = size * 0.18 rem, fontSize = size * 0.07 rem

const FACTORS: Record<number, { top: number; left: number }> = {
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

interface PinButtonProps {
    position: number
    pin: ResolvedPin | undefined
    /** Container size in rem — same as `size` in crystal-registration (default 16) */
    size: number
}

function pinColor(pin: ResolvedPin | undefined): string {
    if (!pin) return grey[300]
    if (pin.sample) return green[400]
    return blue[200]
}

const SampleTooltip: React.FC<{ pin: ResolvedPin }> = ({ pin }) => (
    <Box sx={{ p: 0.5, minWidth: 140 }}>
        <Typography
            variant='caption'
            sx={{ display: 'block', fontWeight: 700 }}
        >
            Position {pin.positionInPuck}
        </Typography>
        {pin.sample?.name && (
            <Typography
                variant='caption'
                sx={{ display: 'block' }}
            >
                Sample: {pin.sample.name}
            </Typography>
        )}
        {pin.barcode && (
            <Typography
                variant='caption'
                sx={{ display: 'block' }}
            >
                Barcode: {pin.barcode}
            </Typography>
        )}
        {pin.loopType && (
            <Typography
                variant='caption'
                sx={{ display: 'block' }}
            >
                Loop: {pin.loopType}
            </Typography>
        )}
        {pin.holderLength != null && (
            <Typography
                variant='caption'
                sx={{ display: 'block' }}
            >
                Holder: {pin.holderLength} mm
            </Typography>
        )}
        {pin.uuid && (
            <Typography
                variant='caption'
                sx={{ display: 'block', wordBreak: 'break-all', opacity: 0.7 }}
            >
                {pin.uuid}
            </Typography>
        )}
    </Box>
)

export const PinButton: React.FC<PinButtonProps> = React.memo(({ position, pin, size }) => {
    const f = FACTORS[position]
    const r = (factor: number) => `${size * factor}rem`
    const color = pinColor(pin)

    return (
        <Tooltip
            title={pin ? <SampleTooltip pin={pin} /> : `Position ${position} — empty`}
            placement='top'
            arrow
            slotProps={{
                tooltip: {
                    sx: {
                        bgcolor: '#f8f9fa',
                        color: 'rgba(0,0,0,0.87)',
                        border: '1px solid #dadde9',
                        boxShadow: 1,
                    },
                },
                arrow: { sx: { color: '#dadde9' } },
            }}
        >
            <Box
                aria-label={`Pin position ${position}${pin?.sample?.name ? `: ${pin.sample.name}` : ''}`}
                sx={{
                    position: 'absolute',
                    top: r(f.top),
                    left: r(f.left),
                    width: r(0.18),
                    height: r(0.18),
                    borderRadius: '50%',
                    backgroundColor: color,
                    color: 'black',
                    fontWeight: 600,
                    fontSize: r(0.07),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s',
                    '&:hover': {
                        backgroundColor: darken(color, 0.2),
                    },
                }}
            >
                {position}
            </Box>
        </Tooltip>
    )
})
