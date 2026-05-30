import type { ResolvedPin } from '@/types/mxlims'
import { pinColor } from '@/utils/pin-color'
import { PIN_FACTORS } from '@/utils/pin-factors'
import { Box, Tooltip } from '@mui/material'
import { darken } from '@mui/material/styles'
import type { FC } from 'react'
import { SampleTooltip } from './sample-tooltip'

interface PinButtonProps {
    position: number
    pin: ResolvedPin | undefined
    /** Container size in rem — same as `size` in crystal-registration */
    size: number
}

export const PinButton: FC<PinButtonProps> = ({ position, pin, size }) => {
    const f = PIN_FACTORS[position]
    const r = (factor: number): string => `${size * factor}rem`
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
                        boxShadow: 0,
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
                    '&:hover': { backgroundColor: darken(color, 0.2) },
                }}
            >
                {position}
            </Box>
        </Tooltip>
    )
}
