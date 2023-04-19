import { Box, Button, Center, Flex, Heading, Input, SimpleGrid, Text } from '@chakra-ui/react';
import { Alchemy, Network, NftOrdering } from 'alchemy-sdk';
import env from 'dotenv';
import { ethers } from 'ethers';
import { useState } from 'react';
import NftCard from './NftCard.jsx';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);

  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [providerAddress, setProviderAddress] = useState('');

  const config = {
    apiKey: env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

  function checkuserInput(addr) {
    setUserAddress(addr);
    if (getAddress(addr)) setIsAddressInvalid(false);
    else setIsAddressInvalid(true);
  }

  async function connectWallet() {
    if (providerAddress) { setProviderAddress(null); return; }
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setProviderAddress(address);
        checkuserInput(address);
        document.getElementById("inputAddress").value = address;
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  async function getNFTsForOwner() {
    if (isAddressInvalid) return;
    setIsQuerying(true);

    const alchemy = new Alchemy(config);
    const data = await alchemy.nft.getNftsForOwner(userAddress, { orderBy: NftOrdering.TRANSFERTIME });
    setResults(data);

    setIsQuerying(false);
  }

  return (
    <Box w="100vw">
      <Center>
        <Flex alignItems={'center'} justifyContent="center" flexDirection={'column'}>
          <Heading mb={0} fontSize={36}>
            NFT Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its NFTs!
          </Text>
        </Flex>
      </Center>

      <Flex w="100%" flexDirection="column" alignItems="center" justifyContent={'center'}>
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
        <Input id='inputAddress' onChange={(e) => checkuserInput(e.target.value)} color="black" w="600px" textAlign="center" p={4} bgColor="white" fontSize={24}
          isDisabled={providerAddress ? true : false} isInvalid={isAddressInvalid} />
        <br />
        <Flex>
          <Box w="40%" >
            <Button onClick={getNFTsForOwner} colorScheme='teal' size='lg' isLoading={isQuerying} >
              Fetch NFTs
            </Button>
          </Box>
          <Box w="20%" ></Box>
          <Box w="40%" >
            <Button onClick={connectWallet} colorScheme='teal' size='lg' isLoading={isQuerying} >
              {!providerAddress ? "Connect" : "Disconnect"}
            </Button>
          </Box>
        </Flex>
        <br />

        {results.ownedNfts && !isQuerying ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
            {
              results.ownedNfts.map((e, i) => {
                return (
                  <NftCard imageSrc={formatImage(results.ownedNfts[i]?.rawMetadata?.image)}
                    fallbackImageSrc={'https://via.placeholder.com/200'}
                    name={results.ownedNfts[i]?.title || 'n/a'}
                    description={results.ownedNfts[i]?.description ? results.ownedNfts[i]?.description : "n/a"}
                    tokenId={results.ownedNfts[i]?.tokenId || "n/a"} />
                );
              })
            }
          </SimpleGrid>
        ) : null}
      </Flex>
    </Box>
  );
}

function formatImage(imageSrc) {
  try {
    if (imageSrc.split("://")[0] === "ipfs")
      return `https://ipfs.io/ipfs/${imageSrc.split("://")[1]}`
  } catch (e) { }
  return imageSrc;
}

function getAddress(addressOrName) {
  try {
    return ethers.utils.getAddress(addressOrName);
  } catch (e) {
    return null;
  }
}

export default App;
