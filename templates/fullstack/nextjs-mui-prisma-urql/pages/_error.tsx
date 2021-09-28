import { Box, Container, Typography } from "@mui/material"
import { NextPageContext } from "next"

interface Props {
    statusCode: number | undefined
}

function Error({ statusCode }: Props) {
    return (

        <Container>
            <Box padding={20}>
                <Typography align="center" variant="h2">
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : 'An error occurred on client'}</Typography>
            </Box>
        </Container>
    )
}

Error.getInitialProps = ({ res, err }: NextPageContext): Props => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error