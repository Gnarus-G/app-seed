import React from 'react'
import { Box, Container, Typography } from '@mui/material'

interface Props { }

function ErrorPage404(props: Props) {
    const { } = props

    return (
        <Container>
            <Box padding={20}>
                <Typography align="center" variant="h2">404 | Not Found.</Typography>
            </Box>
        </Container>
    )
}

export default ErrorPage404
