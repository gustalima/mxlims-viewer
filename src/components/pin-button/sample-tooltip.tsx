import type { ResolvedPin } from '@/types/mxlims'
import { Box, Typography } from '@mui/material'
import type { FC } from 'react'

interface SampleTooltipProps {
    pin: ResolvedPin
}

export const SampleTooltip: FC<SampleTooltipProps> = ({ pin }) => (
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
