import { PuckGrid } from '@/components/puck/puck-grid'
import type { ResolvedDewar, ResolvedPuck } from '@/types/mxlims'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ScienceIcon from '@mui/icons-material/Science'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Chip,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { cyan, teal } from '@mui/material/colors'
import type { FC } from 'react'

interface DewarPanelProps {
    dewar: ResolvedDewar
    defaultExpanded?: boolean
}

const DEWAR_CAPACITY = 7

function buildPuckSlots(dewar: ResolvedDewar): (ResolvedPuck | null)[] {
    const slots: (ResolvedPuck | null)[] = Array(DEWAR_CAPACITY).fill(null)
    const positioned = dewar.pucks.filter((p) => p.positionInDewar != null)
    const unpositioned = dewar.pucks.filter((p) => p.positionInDewar == null)
    for (const p of positioned) {
        const idx = (p.positionInDewar ?? 1) - 1
        if (idx >= 0 && idx < DEWAR_CAPACITY) slots[idx] = p
    }
    let fill = 0
    for (const p of unpositioned) {
        while (fill < DEWAR_CAPACITY && slots[fill] !== null) fill++
        if (fill < DEWAR_CAPACITY) slots[fill++] = p
    }
    return slots
}

export const DewarPanel: FC<DewarPanelProps> = ({ dewar, defaultExpanded }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const totalPins = dewar.pucks.reduce((acc, p) => acc + p.pins.length, 0)
    const filledPins = dewar.pucks.reduce((acc, p) => acc + p.pins.filter((pin) => pin.sample).length, 0)
    const puckSlots = buildPuckSlots(dewar)

    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            elevation={0}
            sx={{
                borderRadius: '8px !important',
                mb: 1,
                '&:before': { display: 'none' },
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ borderRadius: 2 }}
            >
                <Stack
                    direction='row'
                    spacing={1.5}
                    sx={{ alignItems: 'center', flex: 1, mr: 1 }}
                >
                    <Avatar sx={{ bgcolor: cyan[700], width: 36, height: 36 }}>
                        <AcUnitIcon fontSize='small' />
                    </Avatar>
                    <Stack
                        direction='column'
                        spacing={isMobile ? 0.5 : 0}
                        sx={{ flex: 1, minWidth: 0 }}
                    >
                        <Box>
                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 700 }}
                            >
                                {dewar.name ?? dewar.key}
                            </Typography>
                            {dewar.barcode && (
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {dewar.barcode}
                                </Typography>
                            )}
                        </Box>
                        <Stack
                            direction='row'
                            spacing={1}
                            sx={{ flexWrap: 'wrap' }}
                        >
                            <Chip
                                icon={<ScienceIcon sx={{ fontSize: '0.85rem !important' }} />}
                                label={`${dewar.pucks.length} puck${dewar.pucks.length !== 1 ? 's' : ''}`}
                                size='small'
                                sx={{ bgcolor: teal[50], color: teal[800] }}
                            />
                            <Chip
                                label={`${filledPins}/${totalPins} samples`}
                                size='small'
                                color='primary'
                                variant='outlined'
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <PuckGrid pucks={puckSlots} />
            </AccordionDetails>
        </Accordion>
    )
}
