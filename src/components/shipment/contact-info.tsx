import type { Person } from '@/types/mxlims'
import { Box, Link, Typography } from '@mui/material'
import type { FC } from 'react'

interface ContactInfoProps {
    label: string
    person: Person
}

export const ContactInfo: FC<ContactInfoProps> = ({ label, person }) => (
    <Box>
        <Typography
            variant='caption'
            sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
            {label}
        </Typography>
        {person.name && <Typography variant='body2'>{person.name}</Typography>}
        {person.institution && (
            <Typography variant='body2' color='text.secondary'>
                {person.institution}
            </Typography>
        )}
        {person.emailAddress && (
            <Typography variant='body2'>
                <Link href={`mailto:${person.emailAddress}`} underline='hover'>
                    {person.emailAddress}
                </Link>
            </Typography>
        )}
        {person.phone && (
            <Typography variant='body2' color='text.secondary'>
                {person.phone}
            </Typography>
        )}
    </Box>
)
