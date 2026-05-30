/**
 * MXLIMS document validator – converted from the Python pydantic data model at
 * gphl_mxlims/github-repo/mxlims_data_model
 *
 * Validates that a JSON object conforms to the minimum requirements of an
 * MXLIMS document as defined by the Python models (MxlimsObjectData,
 * LogisticalSampleData, ShipmentData, DewarData, PuckData, PinData).
 */

import type { ValidationError, ValidationResult } from '@/types/mxlims'

// ── UUID regex ────────────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// ── Reference regex ───────────────────────────────────────────────────────────

const REF_RE = /^#\/[A-Za-z]+\/[A-Za-z0-9]+$/

// ── Domain key regex (used for extensions / identifiers / urls) ───────────────

const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i

// ── Helper utilities ──────────────────────────────────────────────────────────

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function push(errors: ValidationError[], path: string, message: string) {
    errors.push({ path, message })
}

function validateUuid(v: unknown, path: string, errors: ValidationError[]) {
    if (v !== undefined && v !== null) {
        if (typeof v !== 'string' || !UUID_RE.test(v)) {
            push(errors, path, `Expected a valid UUID string, got: ${JSON.stringify(v)}`)
        }
    }
}

function validateRef(v: unknown, path: string, errors: ValidationError[]) {
    if (!isObject(v)) {
        push(errors, path, 'Expected an object with a $ref string')
        return
    }
    if (typeof v['$ref'] !== 'string' || !REF_RE.test(v['$ref'])) {
        push(errors, `${path}.$ref`, `Expected a reference string like "#/Type/Key", got: ${JSON.stringify(v['$ref'])}`)
    }
}

function validateDomainKeyDict(v: unknown, path: string, errors: ValidationError[]) {
    if (v === undefined || v === null) return
    if (!isObject(v)) {
        push(errors, path, 'Expected an object')
        return
    }
    for (const key of Object.keys(v)) {
        if (!DOMAIN_RE.test(key)) {
            push(errors, `${path}`, `Key "${key}" must be a valid domain name`)
        }
    }
}

// ── Per-type validators ───────────────────────────────────────────────────────

function validateMxlimsObjectData(obj: Record<string, unknown>, path: string, errors: ValidationError[]) {
    // mxlimsType: required string
    if (typeof obj.mxlimsType !== 'string' || obj.mxlimsType.trim() === '') {
        push(errors, `${path}.mxlimsType`, 'Required non-empty string')
    }

    // uuid: optional UUID
    validateUuid(obj.uuid, `${path}.uuid`, errors)

    // annotation: optional string
    if (obj.annotation !== undefined && typeof obj.annotation !== 'string') {
        push(errors, `${path}.annotation`, 'Expected a string')
    }

    // extensions: optional domain-key dict of objects
    if (obj.extensions !== undefined) {
        validateDomainKeyDict(obj.extensions, `${path}.extensions`, errors)
    }

    // identifiers: optional domain-key dict of strings
    if (obj.identifiers !== undefined) {
        validateDomainKeyDict(obj.identifiers, `${path}.identifiers`, errors)
        if (isObject(obj.identifiers)) {
            for (const [k, v] of Object.entries(obj.identifiers)) {
                if (typeof v !== 'string') {
                    push(errors, `${path}.identifiers.${k}`, 'Expected a string value')
                }
            }
        }
    }

    // urls: optional domain-key dict of strings
    if (obj.urls !== undefined) {
        validateDomainKeyDict(obj.urls, `${path}.urls`, errors)
    }
}

function validateLogisticalSample(obj: Record<string, unknown>, path: string, errors: ValidationError[]) {
    validateMxlimsObjectData(obj, path, errors)

    // name: optional string
    if (obj.name !== undefined && typeof obj.name !== 'string') {
        push(errors, `${path}.name`, 'Expected a string')
    }

    // containerRef: optional ref
    if (obj.containerRef !== undefined) {
        validateRef(obj.containerRef, `${path}.containerRef`, errors)
    }
}

function validatePerson(v: unknown, path: string, errors: ValidationError[]) {
    if (v === undefined || v === null) return
    if (!isObject(v)) {
        push(errors, path, 'Expected a Person object')
        return
    }
    for (const field of ['name', 'emailAddress', 'phone', 'institution', 'address'] as const) {
        if (v[field] !== undefined && typeof v[field] !== 'string') {
            push(errors, `${path}.${field}`, 'Expected a string')
        }
    }
}

function validateShipment(obj: Record<string, unknown>, key: string, errors: ValidationError[]) {
    const path = `Shipment.${key}`
    validateLogisticalSample(obj, path, errors)

    // mxlimsType must be "Shipment"
    if (obj.mxlimsType !== 'Shipment') {
        push(errors, `${path}.mxlimsType`, `Expected "Shipment", got "${obj.mxlimsType}"`)
    }

    // proposalCode: required string
    if (typeof obj.proposalCode !== 'string' || obj.proposalCode.trim() === '') {
        push(errors, `${path}.proposalCode`, 'Required non-empty string (proposal number)')
    }

    // sessionNumber: optional positive integer
    if (obj.sessionNumber !== undefined) {
        if (!Number.isInteger(obj.sessionNumber) || (obj.sessionNumber as number) < 1) {
            push(errors, `${path}.sessionNumber`, 'Expected a positive integer')
        }
    }

    // labContactOutbound / labContactReturn: optional Person
    validatePerson(obj.labContactOutbound, `${path}.labContactOutbound`, errors)
    validatePerson(obj.labContactReturn, `${path}.labContactReturn`, errors)
}

function validateDewar(obj: Record<string, unknown>, key: string, errors: ValidationError[]) {
    const path = `Dewar.${key}`
    validateLogisticalSample(obj, path, errors)

    if (obj.mxlimsType !== 'Dewar') {
        push(errors, `${path}.mxlimsType`, `Expected "Dewar", got "${obj.mxlimsType}"`)
    }

    // barcode: optional string
    if (obj.barcode !== undefined && typeof obj.barcode !== 'string') {
        push(errors, `${path}.barcode`, 'Expected a string')
    }
}

function validatePuck(obj: Record<string, unknown>, key: string, errors: ValidationError[]) {
    const path = `Puck.${key}`
    validateLogisticalSample(obj, path, errors)

    if (obj.mxlimsType !== 'Puck') {
        push(errors, `${path}.mxlimsType`, `Expected "Puck", got "${obj.mxlimsType}"`)
    }

    // barcode: optional string
    if (obj.barcode !== undefined && typeof obj.barcode !== 'string') {
        push(errors, `${path}.barcode`, 'Expected a string')
    }

    // positionInDewar: optional positive integer
    if (obj.positionInDewar !== undefined) {
        if (!Number.isInteger(obj.positionInDewar) || (obj.positionInDewar as number) < 1) {
            push(errors, `${path}.positionInDewar`, 'Expected a positive integer')
        }
    }

    // numberPositions: optional positive integer
    if (obj.numberPositions !== undefined) {
        if (!Number.isInteger(obj.numberPositions) || (obj.numberPositions as number) < 1) {
            push(errors, `${path}.numberPositions`, 'Expected a positive integer')
        }
    }

    // puckType: optional string
    if (obj.puckType !== undefined && typeof obj.puckType !== 'string') {
        push(errors, `${path}.puckType`, 'Expected a string')
    }
}

function validatePin(obj: Record<string, unknown>, key: string, errors: ValidationError[]) {
    const path = `Pin.${key}`
    validateLogisticalSample(obj, path, errors)

    if (obj.mxlimsType !== 'Pin') {
        push(errors, `${path}.mxlimsType`, `Expected "Pin", got "${obj.mxlimsType}"`)
    }

    // barcode: optional string
    if (obj.barcode !== undefined && typeof obj.barcode !== 'string') {
        push(errors, `${path}.barcode`, 'Expected a string')
    }

    // positionInPuck: optional positive integer
    if (obj.positionInPuck !== undefined) {
        if (!Number.isInteger(obj.positionInPuck) || (obj.positionInPuck as number) < 1) {
            push(errors, `${path}.positionInPuck`, 'Expected a positive integer')
        }
    }

    // loopType: optional string
    if (obj.loopType !== undefined && typeof obj.loopType !== 'string') {
        push(errors, `${path}.loopType`, 'Expected a string')
    }

    // holderLength: optional number
    if (obj.holderLength !== undefined && typeof obj.holderLength !== 'number') {
        push(errors, `${path}.holderLength`, 'Expected a number')
    }

    // sampleRef: optional ref
    if (obj.sampleRef !== undefined) {
        validateRef(obj.sampleRef, `${path}.sampleRef`, errors)
    }
}

function validateMacromoleculeSample(obj: Record<string, unknown>, key: string, errors: ValidationError[]) {
    const path = `MacromoleculeSample.${key}`
    validateMxlimsObjectData(obj, path, errors)

    if (obj.mxlimsType !== 'MacromoleculeSample') {
        push(errors, `${path}.mxlimsType`, `Expected "MacromoleculeSample", got "${obj.mxlimsType}"`)
    }

    if (obj.name !== undefined && typeof obj.name !== 'string') {
        push(errors, `${path}.name`, 'Expected a string')
    }

    if (obj.parentSampleRef !== undefined) {
        validateRef(obj.parentSampleRef, `${path}.parentSampleRef`, errors)
    }
}

// ── Cross-reference validator ─────────────────────────────────────────────────

function validateRefs(doc: Record<string, unknown>, errors: ValidationError[]) {
    function checkRef(ref: string, sourcePath: string) {
        // ref format: "#/Type/Key"
        const parts = ref.slice(2).split('/')
        if (parts.length !== 2) return
        const [type, key] = parts
        const section = doc[type]
        if (!isObject(section) || !(key in section)) {
            push(errors, sourcePath, `Broken reference "${ref}": "${type}.${key}" not found in document`)
        }
    }

    function walkRefs(node: unknown, path: string) {
        if (!isObject(node)) return
        for (const [k, v] of Object.entries(node)) {
            const childPath = `${path}.${k}`
            if (k === '$ref' && typeof v === 'string') {
                checkRef(v, path)
            } else {
                walkRefs(v, childPath)
            }
        }
    }

    walkRefs(doc, 'root')
}

// ── Top-level validator ───────────────────────────────────────────────────────

export function validateMxlimsDocument(raw: unknown): ValidationResult {
    const errors: ValidationError[] = []

    if (!isObject(raw)) {
        return { valid: false, errors: [{ path: 'root', message: 'Document must be a JSON object' }] }
    }

    // version: optional string
    if (raw.version !== undefined && typeof raw.version !== 'string') {
        push(errors, 'version', 'Expected a string')
    }

    // Must have at least one Shipment
    if (raw.Shipment === undefined || !isObject(raw.Shipment) || Object.keys(raw.Shipment).length === 0) {
        push(errors, 'Shipment', 'Document must contain at least one Shipment')
    } else {
        for (const [key, val] of Object.entries(raw.Shipment)) {
            if (!isObject(val)) {
                push(errors, `Shipment.${key}`, 'Expected an object')
            } else {
                validateShipment(val as Record<string, unknown>, key, errors)
            }
        }
    }

    // Dewar: optional section
    if (raw.Dewar !== undefined) {
        if (!isObject(raw.Dewar)) {
            push(errors, 'Dewar', 'Expected an object')
        } else {
            for (const [key, val] of Object.entries(raw.Dewar)) {
                if (!isObject(val)) {
                    push(errors, `Dewar.${key}`, 'Expected an object')
                } else {
                    validateDewar(val as Record<string, unknown>, key, errors)
                }
            }
        }
    }

    // Puck: optional section
    if (raw.Puck !== undefined) {
        if (!isObject(raw.Puck)) {
            push(errors, 'Puck', 'Expected an object')
        } else {
            for (const [key, val] of Object.entries(raw.Puck)) {
                if (!isObject(val)) {
                    push(errors, `Puck.${key}`, 'Expected an object')
                } else {
                    validatePuck(val as Record<string, unknown>, key, errors)
                }
            }
        }
    }

    // Pin: optional section
    if (raw.Pin !== undefined) {
        if (!isObject(raw.Pin)) {
            push(errors, 'Pin', 'Expected an object')
        } else {
            for (const [key, val] of Object.entries(raw.Pin)) {
                if (!isObject(val)) {
                    push(errors, `Pin.${key}`, 'Expected an object')
                } else {
                    validatePin(val as Record<string, unknown>, key, errors)
                }
            }
        }
    }

    // MacromoleculeSample: optional section
    if (raw.MacromoleculeSample !== undefined) {
        if (!isObject(raw.MacromoleculeSample)) {
            push(errors, 'MacromoleculeSample', 'Expected an object')
        } else {
            for (const [key, val] of Object.entries(raw.MacromoleculeSample)) {
                if (!isObject(val)) {
                    push(errors, `MacromoleculeSample.${key}`, 'Expected an object')
                } else {
                    validateMacromoleculeSample(val as Record<string, unknown>, key, errors)
                }
            }
        }
    }

    // Cross-reference validation (only if structural errors are absent)
    if (errors.length === 0) {
        validateRefs(raw as Record<string, unknown>, errors)
    }

    return { valid: errors.length === 0, errors }
}
