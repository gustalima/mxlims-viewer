// ── MXLIMS Core Types ────────────────────────────────────────────────────────

export interface MxRef {
    $ref: string
}

export interface Person {
    name?: string
    emailAddress?: string
    phone?: string
    institution?: string
    address?: string
}

export interface TrackingDevice {
    barcode?: string
    trackingService?: string
}

// ── MXLIMS Object Types ───────────────────────────────────────────────────────

export interface MxlimsObjectData {
    mxlimsType: string
    uuid?: string
    annotation?: string
    extensions?: Record<string, Record<string, unknown>>
    identifiers?: Record<string, string>
    urls?: Record<string, string>
}

export interface LogisticalSampleData extends MxlimsObjectData {
    name?: string
    containerRef?: MxRef
}

export interface ShipmentData extends LogisticalSampleData {
    mxlimsType: 'Shipment'
    proposalCode: string
    sessionNumber?: number
    labContactOutbound?: Person
    labContactReturn?: Person
    trackingDevice?: TrackingDevice
}

export interface DewarData extends LogisticalSampleData {
    mxlimsType: 'Dewar'
    barcode?: string
    trackingDevice?: TrackingDevice
}

export interface PuckData extends LogisticalSampleData {
    mxlimsType: 'Puck'
    barcode?: string
    positionInDewar?: number
    numberPositions?: number
    puckType?: string
}

export interface PinData extends LogisticalSampleData {
    mxlimsType: 'Pin'
    barcode?: string
    positionInPuck?: number
    loopType?: string
    holderLength?: number
    sampleRef?: MxRef
}

export interface MacromoleculeSampleData extends MxlimsObjectData {
    mxlimsType: 'MacromoleculeSample'
    name?: string
    parentSampleRef?: MxRef
}

export interface MacromoleculeData extends MxlimsObjectData {
    mxlimsType: 'Macromolecule'
    name?: string
    acronym?: string
    molecularMass?: number
    sequence?: string
    spaceGroup?: string
}

// ── MXLIMS Document ───────────────────────────────────────────────────────────

export interface MxlimsDocument {
    version?: string
    Shipment?: Record<string, ShipmentData>
    Dewar?: Record<string, DewarData>
    Puck?: Record<string, PuckData>
    Pin?: Record<string, PinData>
    MacromoleculeSample?: Record<string, MacromoleculeSampleData>
    Macromolecule?: Record<string, MacromoleculeData>
    [key: string]: unknown
}

// ── Resolved / Enriched Types (post-parse) ────────────────────────────────────

export interface ResolvedPin extends PinData {
    key: string
    sample?: MacromoleculeSampleData
}

export interface ResolvedPuck extends PuckData {
    key: string
    pins: ResolvedPin[]
}

export interface ResolvedDewar extends DewarData {
    key: string
    pucks: ResolvedPuck[]
}

export interface ResolvedShipment extends ShipmentData {
    key: string
    dewars: ResolvedDewar[]
}

// ── Validation ────────────────────────────────────────────────────────────────

export interface ValidationError {
    path: string
    message: string
}

export interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
}
