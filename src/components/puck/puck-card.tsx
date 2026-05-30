import { PinButton } from '@/components/pin-button/pin-button'
import type { ResolvedPin, ResolvedPuck } from '@/types/mxlims'
import { Box, Card, CardContent, CardHeader, Chip, Divider, Typography } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import { useEffect, useRef, useState, type FC } from 'react'

// ── Empty puck slot placeholder ───────────────────────────────────────────────

export const PuckPlaceholder: FC<{ slot: number }> = ({ slot }) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            opacity: 0.35,
        }}
    >
        <CardHeader
            title={
                <Typography
                    variant='h6'
                    sx={{ fontWeight: 700, color: 'text.disabled' }}
                    noWrap
                >
                    Slot {slot}
                </Typography>
            }
            sx={{ pb: 0 }}
        />
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box
                sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                }}
            >
                <Typography
                    variant='body2'
                    color='text.disabled'
                >
                    Empty
                </Typography>
            </Box>
        </CardContent>
    </Card>
)

// ── Puck card ─────────────────────────────────────────────────────────────────

const MAX_PINS = 16

export const DEFAULT_PUCK_SIZE = 13

interface PuckCardProps {
    puck: ResolvedPuck
    /** Override the auto-measured size in rem (optional). */
    size?: number
}

export const PuckCard: FC<PuckCardProps> = ({ puck, size: sizeProp }) => {
    const puckBoxRef = useRef<HTMLDivElement>(null)
    const [measuredSize, setMeasuredSize] = useState<number>(DEFAULT_PUCK_SIZE)

    useEffect(() => {
        const el = puckBoxRef.current
        if (!el) return
        const ro = new ResizeObserver(([entry]) => {
            const rootFontPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
            setMeasuredSize(entry.contentRect.width / rootFontPx)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const resolvedSize = sizeProp ?? measuredSize
    const pinByPosition: Record<number, ResolvedPin> = {}
    for (const pin of puck.pins) {
        if (pin.positionInPuck != null) {
            pinByPosition[pin.positionInPuck] = pin
        }
    }

    const filledCount = puck.pins.filter((p) => p.sample).length

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
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
                        label={`${filledCount}/${MAX_PINS}`}
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
                <Box
                    ref={puckBoxRef}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1',
                        backgroundImage: 'url(/unipuck.webp)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {Array.from({ length: MAX_PINS }, (_, i) => i + 1).map((pos) => (
                        <PinButton
                            key={pos}
                            position={pos}
                            size={resolvedSize}
                            pin={pinByPosition[pos]}
                        />
                    ))}
                </Box>

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
                        {Array.from({ length: MAX_PINS }, (_, i) => i + 1).map((pos) => {
                            const pin = pinByPosition[pos]
                            return (
                                <Box
                                    key={pos}
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'baseline',
                                        borderRadius: 1,
                                        px: 0.5,
                                        py: 0.25,
                                        opacity: pin ? 1 : 0.35,
                                    }}
                                >
                                    <Chip
                                        label={pos}
                                        size='small'
                                        sx={{ height: 18, fontSize: '0.65rem', width: 28, flexShrink: 0 }}
                                    />
                                    <Typography
                                        variant='caption'
                                        noWrap
                                    >
                                        {pin?.sample?.name ?? <em>empty</em>}
                                    </Typography>
                                </Box>
                            )
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
