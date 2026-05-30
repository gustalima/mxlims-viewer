import type { ResolvedPuck } from '@/types/mxlims'
import { Grid } from '@mui/material'
import type { FC } from 'react'
import { PuckCard, PuckPlaceholder } from './puck-card'

interface PuckGridProps {
    pucks: (ResolvedPuck | null)[]
}

export const PuckGrid: FC<PuckGridProps> = ({ pucks }) => (
    <Grid
        container
        spacing={2}
        columns={{ xs: 2, sm: 4, md: 7 }}
    >
        {pucks.map((puck, i) => (
            <Grid
                key={puck?.key ?? `empty-${i}`}
                size={1}
            >
                {puck ?
                    <PuckCard puck={puck} />
                :   <PuckPlaceholder slot={i + 1} />}
            </Grid>
        ))}
    </Grid>
)
