import { Box, Card, CardContent, CardHeader, Chip, Divider, Grid, Typography } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import React from 'react'
import type { ResolvedPin, ResolvedPuck } from '../types/mxlims'
import { PinButton } from './PinButton'

const MAX_PINS = 16

/** Default puck size in rem — matches crystal-registration non-HDPI (10 * scaleSize=1.6) */
export const DEFAULT_PUCK_SIZE = 13

interface PuckCardProps {
    puck: ResolvedPuck
    /** Puck container size in rem (default: DEFAULT_PUCK_SIZE) */
    size?: number
}

export const PuckCard: React.FC<PuckCardProps> = ({ puck, size = DEFAULT_PUCK_SIZE }) => {
    const pinByPosition: Record<number, ResolvedPin> = {}
    for (const pin of puck.pins) {
        if (pin.positionInPuck != null) {
            pinByPosition[pin.positionInPuck] = pin
        }
    }

    const filledCount = puck.pins.filter((p) => p.sample).length
    const totalPins = puck.pins.length

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                display: 'inline-flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6 },
            }}
        >
            <CardHeader
                title={
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 700 }}
                        noWrap
                    >
                        {puck.name ?? puck.key}
                    </Typography>
                }
                subheader={undefined}
                action={
                    <Chip
                        label={`${filledCount}/${totalPins} pins`}
                        size='small'
                        sx={{
                            bgcolor: filledCount > 0 ? green[100] : grey[200],
                            color: filledCount > 0 ? green[800] : grey[700],
                            fontWeight: 600,
                            mt: 0.5,
                            mr: 0.5,
                        }}
                    />
                }
                sx={{ pb: 0 }}
            />

            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    p: 2,
                    '&:last-child': { pb: 2 },
                }}
            >
                {/* Unipuck diagram */}
                <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: `${size}rem`,
                            height: `${size}rem`,
                            backgroundImage: 'url(/unipuck.webp)',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {Array.from({ length: MAX_PINS }, (_, i) => i + 1).map((pos) => (
                            <PinButton
                                key={pos}
                                position={pos}
                                size={size}
                                pin={pinByPosition[pos]}
                            />
                        ))}
                    </Box>
                </Box>
                <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ display: 'none' }}
                />
                {/* Pin list */}
                {puck.pins.length > 0 && (
                    <Box>
                        <Divider sx={{ mb: 1 }} />
                        <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ fontWeight: 600 }}
                        >
                            Samples
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                            {puck.pins.map((pin) => (
                                <Box
                                    key={pin.key}
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'baseline',
                                        borderRadius: 1,
                                        px: 0.5,
                                        py: 0.25,
                                    }}
                                >
                                    <Chip
                                        label={pin.positionInPuck}
                                        size='small'
                                        sx={{ height: 18, fontSize: '0.65rem', minWidth: 24 }}
                                    />
                                    <Typography
                                        variant='caption'
                                        noWrap
                                    >
                                        {pin.sample?.name ?? <em>empty</em>}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}

interface PuckGridProps {
    pucks: ResolvedPuck[]
    /** Puck container size in rem passed down to each PuckCard */
    size?: number
}

export const PuckGrid: React.FC<PuckGridProps> = ({ pucks, size }) => (
    <Grid
        container
        spacing={2}
    >
        {pucks.map((puck) => (
            <Grid
                key={puck.key}
                size='auto'
            >
                <PuckCard
                    puck={puck}
                    size={size}
                />
            </Grid>
        ))}
    </Grid>
)
