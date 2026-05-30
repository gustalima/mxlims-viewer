import type { ResolvedPuck } from '@/types/mxlims'
import { Grid } from '@mui/material'
import type { FC } from 'react'
import { PuckCard } from './puck-card'

interface PuckGridProps {
    pucks: ResolvedPuck[]
    /** Puck container size in rem passed down to each PuckCard */
    size?: number
}

export const PuckGrid: FC<PuckGridProps> = ({ pucks, size }) => (
    <Grid container spacing={2}>
        {pucks.map((puck) => (
            <Grid key={puck.key} size='auto'>
                <PuckCard puck={puck} size={size} />
            </Grid>
        ))}
    </Grid>
)
