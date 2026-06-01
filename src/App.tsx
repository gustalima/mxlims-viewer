import { FileUpload } from '@/components/file-upload/file-upload'
import { UnipuckIcon } from '@/components/puck/puck-icon'
import { ShipmentPanel } from '@/components/shipment/shipment-panel'
import { SummaryTable } from '@/components/summary-table/summary-table'
import { useMxlimsFile } from '@/hooks/use-mxlims-file'
import { readJsonFile } from '@/utils/read-json-file'
import GitHubIcon from '@mui/icons-material/GitHub'
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import './firebase'

export default function App() {
    const { shipments, validationResult, handleFile, handleClear } = useMxlimsFile()
    const [dragActive, setDragActive] = useState(false)

    function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (!file) return
        readJsonFile(file, handleFile)
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault()
        setDragActive(true)
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault()
        setDragActive(false)
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: dragActive ? 'action.selected' : 'grey.50',
            }}
            onDrop={handleDrop}
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <AppBar
                position='sticky'
                elevation={0}
                color='default'
                sx={{
                    bgcolor: 'grey.200',
                    borderBottom: '1px solid',
                    borderColor: 'grey.300',
                }}
            >
                <Toolbar>
                    <UnipuckIcon sx={{ mr: 1.5 }} />
                    <Typography
                        variant='h6'
                        sx={{ fontWeight: 700, flex: 1 }}
                    >
                        MXLIMS Unipuck Viewer
                    </Typography>

                    <Button
                        variant='outlined'
                        color='inherit'
                        size='small'
                        onClick={handleClear}
                        sx={{ mr: 2 }}
                        disabled={shipments.length === 0 && validationResult === null}
                    >
                        Clear
                    </Button>
                    <IconButton
                        component='a'
                        href='https://github.com/gustalima/mxlims-viewer'
                        target='_blank'
                        rel='noopener noreferrer'
                        color='inherit'
                        size='small'
                    >
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth={false}
                sx={{ pt: 4, pb: 0, px: { xs: 2, sm: 3, md: 4 } }}
            >
                {shipments.length === 0 && (
                    <Box sx={{ mb: 4 }}>
                        <FileUpload
                            onFile={handleFile}
                            validationResult={validationResult}
                        />
                    </Box>
                )}

                {shipments.length > 0 && (
                    <>
                        {shipments.map((shipment) => (
                            <ShipmentPanel
                                key={shipment.key}
                                shipment={shipment}
                            />
                        ))}
                        <SummaryTable shipments={shipments} />
                    </>
                )}
            </Container>
        </Box>
    )
}
