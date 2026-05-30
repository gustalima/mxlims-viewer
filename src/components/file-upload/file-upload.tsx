import type { ValidationResult } from '@/types/mxlims'
import { readJsonFile } from '@/utils/read-json-file'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Alert, Box, Button, Paper, Typography } from '@mui/material'
import { useRef, type FC } from 'react'

interface FileUploadProps {
    onFile: (raw: unknown) => void
    validationResult: ValidationResult | null
}

export const FileUpload: FC<FileUploadProps> = ({ onFile, validationResult }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files?.[0]
        if (!file) return
        readJsonFile(file, onFile)
        e.target.value = ''
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (!file) return
        readJsonFile(file, onFile)
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault()
    }

    return (
        <Box>
            <Paper
                variant='outlined'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    '&:hover': { background: 'action.hover' },
                }}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type='file'
                    accept='.json,application/json'
                    hidden
                    onChange={handleChange}
                />
                <UploadFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography
                    variant='h6'
                    gutterBottom
                >
                    Drop an MXLIMS JSON file here
                </Typography>
                <Typography
                    variant='body2'
                    color='text.secondary'
                    gutterBottom
                >
                    or click to browse
                </Typography>
                <Button
                    variant='contained'
                    size='small'
                    sx={{ mt: 1 }}
                    onClick={(e) => {
                        e.stopPropagation()
                        inputRef.current?.click()
                    }}
                >
                    Browse file
                </Button>
            </Paper>

            {validationResult && !validationResult.valid && (
                <Alert
                    severity='error'
                    sx={{ mt: 2 }}
                >
                    <Typography
                        variant='subtitle2'
                        sx={{ fontWeight: 700 }}
                        gutterBottom
                    >
                        Validation failed — {validationResult.errors.length} error
                        {validationResult.errors.length > 1 ? 's' : ''}
                    </Typography>
                    <Box
                        component='ul'
                        sx={{ m: 0, pl: 2 }}
                    >
                        {validationResult.errors.slice(0, 20).map((err, i) => (
                            <li key={i}>
                                <Typography variant='caption'>
                                    <strong>{err.path}</strong>: {err.message}
                                </Typography>
                            </li>
                        ))}
                        {validationResult.errors.length > 20 && (
                            <li>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    … and {validationResult.errors.length - 20} more
                                </Typography>
                            </li>
                        )}
                    </Box>
                </Alert>
            )}

            {validationResult?.valid && (
                <Alert
                    severity='success'
                    sx={{ mt: 2 }}
                >
                    File validated successfully.
                </Alert>
            )}
        </Box>
    )
}
