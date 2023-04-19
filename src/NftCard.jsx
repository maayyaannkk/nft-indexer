import { Box, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useState } from 'react';

export default function NftCard({ fallbackImageSrc, imageSrc, name, description, tokenId }) {
    const [fallbackImage, setFallbackImage] = useState(false);
    return (
        <Card maxW='sm' bg="gray.800">
            <CardBody display="flex" flexDirection="column">
                <Box height="300px" width="100%">
                    <Image src={fallbackImage ? fallbackImageSrc : imageSrc} alt={name} borderRadius='lg' objectFit='cover' height='100%' width='100%'
                        onError={() => setFallbackImage(true)}
                        fallbackSrc={fallbackImageSrc} />
                </Box>
                <Stack mt='6' spacing='3'>
                    <Heading size='md' color='white'>{name}</Heading>
                    <Text color='white' noOfLines={[1, 2, 3]}>{description}</Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <Text color='cyan.600' fontSize='2xl'>{tokenId}</Text>
                </CardFooter>
        </Card>
    );
}