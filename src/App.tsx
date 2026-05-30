import { FileUpload } from '@/components/file-upload/file-upload'
import { ShipmentPanel } from '@/components/shipment/shipment-panel'
import { SummaryTable } from '@/components/summary-table/summary-table'
import { useMxlimsFile } from '@/hooks/use-mxlims-file'
import ScienceIcon from '@mui/icons-material/Science'
import { AppBar, Box, Button, Container, Divider, Toolbar, Typography } from '@mui/material'

export default function App() {
    const { shipments, validationResult, handleFile, handleClear } = useMxlimsFile()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <AppBar position='sticky' elevation={2}>
                <Toolbar>
                    <ScienceIcon sx={{ mr: 1.5 }} />
                    <Typography variant='h6' sx={{ fontWeight: 700, flex: 1 }}>
                        MXLIMS Viewer
                    </Typography>
                    <Button
                        variant='outlined'
                        color='inherit'
                        size='small'
                        onClick={handleClear}
                        disabled={shipments.length === 0 && validationResult === null}
                    >
                        Clear
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
                {shipments.length === 0 && (
                    <Box sx={{ mb: 4 }}>
                        <FileUpload onFile={handleFile} validationResult={validationResult} />
                        <Divider sx={{ mt: 4 }} />
                    </Box>
                )}

                {shipments.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ScienceIcon sx={{ fontSize: 72, color: 'grey.400', mb: 2 }} />
                        <Typography variant='h5' color='text.secondary'>
                            No data loaded
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                            Upload an MXLIMS JSON file to get started.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {shipments.map((shipment) => (
                            <ShipmentPanel key={shipment.key} shipment={shipment} />
                        ))}
                        <SummaryTable shipments={shipments} />
                    </>
                )}
            </Container>
        </Box>
    )
}
