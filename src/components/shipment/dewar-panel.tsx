import { PuckGrid } from '@/components/puck/puck-grid'
import type { ResolvedDewar } from '@/types/mxlims'
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

export const DewarPanel: FC<DewarPanelProps> = ({ dewar, defaultExpanded }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const totalPins = dewar.pucks.reduce((acc, p) => acc + p.pins.length, 0)
    const filledPins = dewar.pucks.reduce((acc, p) => acc + p.pins.filter((pin) => pin.sample).length, 0)

    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            elevation={2}
            sx={{ borderRadius: '12px !important', mb: 1, '&:before': { display: 'none' } }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ borderRadius: 3 }}
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
                {dewar.pucks.length === 0 ?
                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ py: 2, textAlign: 'center' }}
                    >
                        No pucks in this dewar.
                    </Typography>
                :   <PuckGrid pucks={dewar.pucks} />}
            </AccordionDetails>
        </Accordion>
    )
}
