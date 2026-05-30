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
    Divider,
    Link,
    Stack,
    Typography,
} from '@mui/material'
import { cyan, teal } from '@mui/material/colors'
import React from 'react'
import type { Person, ResolvedDewar, ResolvedShipment } from '../types/mxlims'
import { PuckGrid } from './PuckCard'

// ── Dewar panel ───────────────────────────────────────────────────────────────

interface DewarPanelProps {
    dewar: ResolvedDewar
    defaultExpanded?: boolean
}

const DewarPanel: React.FC<DewarPanelProps> = ({ dewar, defaultExpanded }) => {
    const totalPins = dewar.pucks.reduce((acc, p) => acc + p.pins.length, 0)
    const filledPins = dewar.pucks.reduce((acc, p) => acc + p.pins.filter((pin) => pin.sample).length, 0)

    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            sx={{ borderRadius: '12px !important', mb: 1, '&:before': { display: 'none' } }}
            elevation={2}
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
                    <Box sx={{ flex: 1 }}>
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

// ── Shipment panel ────────────────────────────────────────────────────────────

interface ShipmentPanelProps {
    shipment: ResolvedShipment
}

export const ShipmentPanel: React.FC<ShipmentPanelProps> = ({ shipment }) => {
    const totalPucks = shipment.dewars.reduce((acc, d) => acc + d.pucks.length, 0)
    const totalPins = shipment.dewars.reduce((acc, d) => acc + d.pucks.reduce((a2, p) => a2 + p.pins.length, 0), 0)
    const outbound = shipment.labContactOutbound
    const ret = shipment.labContactReturn

    const ContactInfo = ({ label, person }: { label: string; person: Person }) => (
        <Box>
            <Typography
                variant='caption'
                sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
                {label}
            </Typography>
            {person.name && <Typography variant='body2'>{person.name}</Typography>}
            {person.institution && (
                <Typography
                    variant='body2'
                    color='text.secondary'
                >
                    {person.institution}
                </Typography>
            )}
            {person.emailAddress && (
                <Typography variant='body2'>
                    <Link
                        href={`mailto:${person.emailAddress}`}
                        underline='hover'
                    >
                        {person.emailAddress}
                    </Link>
                </Typography>
            )}
            {person.phone && (
                <Typography
                    variant='body2'
                    color='text.secondary'
                >
                    {person.phone}
                </Typography>
            )}
        </Box>
    )

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
                    {identifiers.map(([system, id]) => (
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
                            {/* prefer a URL for this system if available */}
                            {urls.find(([s]) => s === system) ?
                                <Typography variant='body2'>
                                    <Link
                                        href={urls.find(([s]) => s === system)![1]}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        underline='hover'
                                    >
                                        {id}
                                    </Link>
                                </Typography>
                            :   <Typography variant='body2'>{id}</Typography>}
                        </Box>
                    ))}
                    {/* URLs with no matching identifier */}
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
