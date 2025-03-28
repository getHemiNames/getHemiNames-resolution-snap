import type {
  OnNameLookupHandler,
  OnHomePageHandler
} from '@metamask/snaps-sdk';
import {
  Box,
  Card,
  Divider,
  Heading,
  Link,
  Text,
} from '@metamask/snaps-sdk/jsx';
import { createPublicClient, http } from 'viem';
import { normalize } from 'viem/ens';
import { defineChain } from 'viem';

import logo from '../images/logo.svg'

export const hemi = defineChain({
  id: 43111,
  name: "Hemi Network",
  network: "Hemi Network",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: ["https://rpc.hemi.network/rpc"],
    },
    default: {
      http: ["https://rpc.hemi.network/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Hemi Explorer",
      url: "https://explorer.hemi.xyz/",
    },
  },

  contracts: {
    multicall3: {
      // TODO : Multicall3 Address -- https://etherscan.io/address/0xcA11bde05977b3631167028862bE2a173976CA11#code
      address: "0x3FBA66680F0F468089233bB14E40725eCB66AF7A",
    },
    ensRegistry: {
      address: "0x099fee7f2ef53eb7ccc0e465a32f3aefa8d703c5"
    },
    ensUniversalResolver: {
      address: "0x4bb8573ddb5b8369c87bd6d7e34137d7ce674f2b",
      blockCreated: 1360113,
    },
  },
})

/**
 * Handle incoming name lookup requests from the MetaMask clients.
 *
 * @param request - The request arguments.
 * @param request.domain - The domain to resolve. Will be undefined if an address is provided.
 * @param request.address - The address to resolve. Will be undefined if a domain is provided.
 * @param request.chainId - The CAIP-2 chain ID of the associated network.
 * @returns If successful, an object containing the resolvedDomain or resolvedAddress. Null otherwise.
 * @see https://docs.metamask.io/snaps/reference/exports/#onnamelookup
 */
export const onNameLookup: OnNameLookupHandler = async (request) => {
  let { domain } = request;

  if (!domain) {
    return null;
  }

  const client = createPublicClient({
    chain: hemi,
    transport: http(),
  });

  const resolvedAddress = await client.getEnsAddress({
    name: normalize(domain),
  });

  if (!resolvedAddress) {
    return null;
  }

  return {
    resolvedAddresses: [
      {
        resolvedAddress,
        protocol: 'getHemiNames',
        domainName: domain,
      },
    ],
  };
};

export const onHomePage: OnHomePageHandler = async () => {
  return {
    content: (
      <Box>
        <Card image={logo} title={'getHemiNames Snap'} value={''} />
        <Divider />
        <Text>Welcome to the getHemiNames Snap !</Text>
        <Text>
          Replace your long wallet address with an easy-to-share .hemi 
          domain for sending and receiving crypto assets.
        </Text>
        <Text>
          After installing the Snap, you can immediately send and
          receive cryptocurrencies with your .hemi domains!
        </Text>
        <Heading size={'sm'}>Please note:</Heading>
        <Text>
          The getHemiNames Snap is compatible with Web3 domains that are registered
          and minted via official getHemiNames partner registrars.
        </Text>
        <Heading size={'sm'}>More info:</Heading>
        <Link href={'https://getheminames.me/'}>getHemiNames official website</Link>
      </Box>
    ),
  };
};

