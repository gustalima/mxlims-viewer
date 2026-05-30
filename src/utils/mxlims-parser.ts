/**
 * Resolve $ref pointers in an MXLIMS document and build a tree of
 * Shipment → Dewar → Puck → Pin (with sample data).
 */

import type {
    MacromoleculeSampleData,
    MxlimsDocument,
    ResolvedDewar,
    ResolvedPin,
    ResolvedPuck,
    ResolvedShipment,
} from '@/types/mxlims'

function resolveRef<T>(ref: string, doc: MxlimsDocument): T | undefined {
    // ref format: "#/Type/Key"
    const parts = ref.slice(2).split('/')
    if (parts.length !== 2) return undefined
    const [type, key] = parts
    const section = doc[type] as Record<string, T> | undefined
    return section?.[key]
}

export function parseMxlimsDocument(doc: MxlimsDocument): ResolvedShipment[] {
    const shipments = doc.Shipment ?? {}
    const dewars = doc.Dewar ?? {}
    const pucks = doc.Puck ?? {}
    const pins = doc.Pin ?? {}
    // MacromoleculeSample section is resolved per-pin via resolveRef below

    // Build dewar → pucks index
    const pucksByDewar: Record<string, string[]> = {}
    for (const [puckKey, puck] of Object.entries(pucks)) {
        const containerRef = puck.containerRef?.$ref
        if (containerRef) {
            const parts = containerRef.slice(2).split('/')
            const dewarKey = parts[1]
            if (dewarKey) {
                if (!pucksByDewar[dewarKey]) pucksByDewar[dewarKey] = []
                pucksByDewar[dewarKey].push(puckKey)
            }
        }
    }

    // Build puck → pins index
    const pinsByPuck: Record<string, string[]> = {}
    for (const [pinKey, pin] of Object.entries(pins)) {
        const containerRef = pin.containerRef?.$ref
        if (containerRef) {
            const parts = containerRef.slice(2).split('/')
            const puckKey = parts[1]
            if (puckKey) {
                if (!pinsByPuck[puckKey]) pinsByPuck[puckKey] = []
                pinsByPuck[puckKey].push(pinKey)
            }
        }
    }

    // Build shipment → dewars index
    const dewarsByShipment: Record<string, string[]> = {}
    for (const [dewarKey, dewar] of Object.entries(dewars)) {
        const containerRef = dewar.containerRef?.$ref
        if (containerRef) {
            const parts = containerRef.slice(2).split('/')
            const shipmentKey = parts[1]
            if (shipmentKey) {
                if (!dewarsByShipment[shipmentKey]) dewarsByShipment[shipmentKey] = []
                dewarsByShipment[shipmentKey].push(dewarKey)
            }
        }
    }

    return Object.entries(shipments).map(([shipmentKey, shipment]) => {
        const shipmentDewars: ResolvedDewar[] = (dewarsByShipment[shipmentKey] ?? []).map((dewarKey) => {
            const dewar = dewars[dewarKey]
            const dewarPucks: ResolvedPuck[] = (pucksByDewar[dewarKey] ?? []).map((puckKey) => {
                const puck = pucks[puckKey]

                const resolvedPins: ResolvedPin[] = (pinsByPuck[puckKey] ?? [])
                    .map((pinKey) => {
                        const pin = pins[pinKey]
                        let sample: MacromoleculeSampleData | undefined
                        if (pin.sampleRef?.$ref) {
                            sample = resolveRef<MacromoleculeSampleData>(pin.sampleRef.$ref, doc)
                        }
                        return { ...pin, key: pinKey, sample } as ResolvedPin
                    })
                    .sort((a, b) => (a.positionInPuck ?? 0) - (b.positionInPuck ?? 0))

                return { ...puck, key: puckKey, pins: resolvedPins } as ResolvedPuck
            })

            return { ...dewar, key: dewarKey, pucks: dewarPucks } as ResolvedDewar
        })

        return { ...shipment, key: shipmentKey, dewars: shipmentDewars } as ResolvedShipment
    })
}
