import type { MxlimsDocument, ResolvedShipment, ValidationResult } from '@/types/mxlims'
import { parseMxlimsDocument } from '@/utils/mxlims-parser'
import { validateMxlimsDocument } from '@/utils/mxlims-validator'
import { useState } from 'react'

interface UseMxlimsFileResult {
    shipments: ResolvedShipment[]
    validationResult: ValidationResult | null
    handleFile: (raw: unknown) => void
    handleClear: () => void
}

export function useMxlimsFile(): UseMxlimsFileResult {
    const [shipments, setShipments] = useState<ResolvedShipment[]>([])
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

    function handleFile(raw: unknown): void {
        if (raw === null) {
            setValidationResult({ valid: false, errors: [{ path: 'root', message: 'Invalid JSON file' }] })
            return
        }
        const result = validateMxlimsDocument(raw)
        setValidationResult(result)
        if (result.valid) {
            setShipments(parseMxlimsDocument(raw as MxlimsDocument))
        }
    }

    function handleClear(): void {
        setShipments([])
        setValidationResult(null)
    }

    return { shipments, validationResult, handleFile, handleClear }
}
