import type { ResolvedShipment } from '@/types/mxlims'
import { Box, Chip, Divider, Link, Stack, Typography } from '@mui/material'
import type { FC } from 'react'
import { ContactInfo } from './contact-info'
import { DewarPanel } from './dewar-panel'

interface ShipmentPanelProps {
    shipment: ResolvedShipment
}

export const ShipmentPanel: FC<ShipmentPanelProps> = ({ shipment }) => {
    const totalPucks = shipment.dewars.reduce((acc, d) => acc + d.pucks.length, 0)
    const totalPins = shipment.dewars.reduce((acc, d) => acc + d.pucks.reduce((a2, p) => a2 + p.pins.length, 0), 0)
    const outbound = shipment.labContactOutbound
    const ret = shipment.labContactReturn
    const identifiers = shipment.identifiers ? Object.entries(shipment.identifiers) : []
    const urls = shipment.urls ? Object.entries(shipment.urls) : []

    return (
        <Box sx={{ mb: 4 }}>
            <Stack
                direction='row'
                spacing={2}
                sx={{ alignItems: 'baseline', mb: 0.5, flexWrap: 'wrap' }}
            >
                <Typography
                    variant='h4'
                    sx={{ fontWeight: 700 }}
                >
                    {shipment.proposalCode}
                </Typography>
                {shipment.sessionNumber != null && (
                    <Typography
                        variant='h6'
                        color='text.secondary'
                    >
                        Session {shipment.sessionNumber}
                    </Typography>
                )}
            </Stack>

            {shipment.uuid && (
                <Typography
                    variant='caption'
                    color='text.disabled'
                    sx={{ display: 'block', mb: 1, wordBreak: 'break-all' }}
                >
                    {shipment.uuid}
                </Typography>
            )}

            {(identifiers.length > 0 || urls.length > 0) && (
                <Stack
                    direction='row'
                    spacing={3}
                    sx={{ mb: 1.5, flexWrap: 'wrap' }}
                >
                    {identifiers.map(([system, id]) => {
                        const matchingUrl = urls.find(([s]) => s === system)
                        return (
                            <Box key={system}>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.secondary',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {system}
                                </Typography>
                                {matchingUrl ?
                                    <Typography variant='body2'>
                                        <Link
                                            href={matchingUrl[1]}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            underline='hover'
                                        >
                                            {id}
                                        </Link>
                                    </Typography>
                                :   <Typography variant='body2'>{id}</Typography>}
                            </Box>
                        )
                    })}
                    {urls
                        .filter(([s]) => !identifiers.find(([si]) => si === s))
                        .map(([system, url]) => (
                            <Box key={system}>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.secondary',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {system}
                                </Typography>
                                <Typography variant='body2'>
                                    <Link
                                        href={url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        underline='hover'
                                    >
                                        {url}
                                    </Link>
                                </Typography>
                            </Box>
                        ))}
                </Stack>
            )}

            <Stack
                direction='row'
                spacing={2}
                sx={{ alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}
            >
                {outbound && (
                    <ContactInfo
                        label='Outbound contact'
                        person={outbound}
                    />
                )}
                {ret && ret !== outbound && (
                    <ContactInfo
                        label='Return contact'
                        person={ret}
                    />
                )}
                <Stack
                    direction='row'
                    spacing={1}
                    sx={{ alignItems: 'center', flexWrap: 'wrap', pt: outbound || ret ? 2.5 : 0 }}
                >
                    <Chip
                        label={`${shipment.dewars.length} dewar${shipment.dewars.length !== 1 ? 's' : ''}`}
                        size='small'
                        variant='outlined'
                    />
                    <Chip
                        label={`${totalPucks} puck${totalPucks !== 1 ? 's' : ''}`}
                        size='small'
                        variant='outlined'
                    />
                    <Chip
                        label={`${totalPins} sample${totalPins !== 1 ? 's' : ''}`}
                        size='small'
                        color='primary'
                        variant='outlined'
                    />
                </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {shipment.dewars.length === 0 ?
                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ py: 2, textAlign: 'center' }}
                >
                    No dewars in this shipment.
                </Typography>
            :   shipment.dewars.map((dewar) => (
                    <DewarPanel
                        key={dewar.key}
                        dewar={dewar}
                        defaultExpanded
                    />
                ))
            }
        </Box>
    )
}
