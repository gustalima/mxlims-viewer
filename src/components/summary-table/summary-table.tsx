import type { ResolvedShipment } from '@/types/mxlims'
import {
    Box,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import type { FC } from 'react'

interface SummaryTableProps {
    shipments: ResolvedShipment[]
}

interface SummaryRow {
    dewar: string
    puck: string
    position: number | undefined
    sample: string
    loopType: string
    holderLength: string
    barcode: string
    uuid: string
}

function buildRows(shipments: ResolvedShipment[]): SummaryRow[] {
    const rows: SummaryRow[] = []
    for (const shipment of shipments) {
        for (const dewar of shipment.dewars) {
            for (const puck of dewar.pucks) {
                for (const pin of puck.pins) {
                    rows.push({
                        dewar: dewar.name ?? dewar.key,
                        puck: puck.name ?? puck.key,
                        position: pin.positionInPuck,
                        sample: pin.sample?.name ?? '—',
                        loopType: pin.loopType ?? '—',
                        holderLength: pin.holderLength != null ? `${pin.holderLength} mm` : '—',
                        barcode: pin.barcode ?? '—',
                        uuid: pin.uuid ?? '—',
                    })
                }
            }
        }
    }
    return rows
}

export const SummaryTable: FC<SummaryTableProps> = ({ shipments }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const rows = buildRows(shipments)

    if (rows.length === 0 || isMobile) return null

    return (
        <Box sx={{ mt: 6, pb: 2 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography
                variant='h5'
                sx={{ fontWeight: 700, mb: 2 }}
            >
                Summary
            </Typography>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
            >
                <Table
                    size='small'
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Dewar</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Puck</TableCell>
                            <TableCell
                                sx={{ fontWeight: 700 }}
                                align='center'
                            >
                                Pos.
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Sample</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Loop type</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Holder length</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Pin barcode</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>UUID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) => {
                            const prevRow = rows[idx - 1]
                            const dewarChanged = !prevRow || prevRow.dewar !== row.dewar
                            const puckChanged = !prevRow || prevRow.puck !== row.puck || dewarChanged
                            const dewarRowSpan = dewarChanged ? rows.filter((r) => r.dewar === row.dewar).length : 0
                            const puckRowSpan =
                                puckChanged ?
                                    rows.filter((r) => r.dewar === row.dewar && r.puck === row.puck).length
                                :   0

                            return (
                                <TableRow
                                    key={idx}
                                    sx={{
                                        '&:last-child td': { border: 0 },
                                        bgcolor: idx % 2 === 0 ? 'transparent' : 'action.hover',
                                    }}
                                >
                                    {dewarChanged && (
                                        <TableCell
                                            rowSpan={dewarRowSpan}
                                            sx={{
                                                fontWeight: 600,
                                                verticalAlign: 'top',
                                                borderRight: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            {row.dewar}
                                        </TableCell>
                                    )}
                                    {puckChanged && (
                                        <TableCell
                                            rowSpan={puckRowSpan}
                                            sx={{
                                                verticalAlign: 'top',
                                                borderRight: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            {row.puck}
                                        </TableCell>
                                    )}
                                    <TableCell align='center'>{row.position ?? '—'}</TableCell>
                                    <TableCell>{row.sample}</TableCell>
                                    <TableCell>{row.loopType}</TableCell>
                                    <TableCell>{row.holderLength}</TableCell>
                                    <TableCell>{row.barcode}</TableCell>
                                    <TableCell
                                        sx={{ fontSize: '0.7rem', color: 'text.secondary', wordBreak: 'break-all' }}
                                    >
                                        {row.uuid}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
