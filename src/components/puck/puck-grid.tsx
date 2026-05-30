import type { ResolvedPuck } from '@/types/mxlims'
import { Grid } from '@mui/material'
import type { FC } from 'react'
import { PuckCard } from './puck-card'

interface PuckGridProps {
    pucks: ResolvedPuck[]
}

export const PuckGrid: FC<PuckGridProps> = ({ pucks }) => (
    <Grid container spacing={2}>
        {pucks.map((puck) => (
            <Grid key={puck.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <PuckCard puck={puck} />
            </Grid>
        ))}
    </Grid>
)
