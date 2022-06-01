import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';

import Button from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Container } from '../../../components/Layout';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  activateCommunityPoolTransaction,
  addToWhitelistOwner,
  addToWhitelistTransaction,
  createCommunityPool,
} from '../../../contexts/nftPools/transactions';
import { useConnection } from '../../../hooks';

export const NFTPoolsTestPage: FC = () => {
  const connection = useConnection();
  const wallet = useWallet();

  const [communityPoolAddress, setCommunityPoolAddress] = useState('');
  const [whitelistedAddress, setWhitelistedAddress] = useState('');

  const [communityPoolAddressOwner, setCommunityPoolAddressOwner] =
    useState('');
  const [whitelistedAddressOwner, setWhitelistedAddressOwner] = useState('');

  const [activateCommunityPool, setActivateCommunityPool] = useState('');

  const onCreateCommunityPool = async () => {
    await createCommunityPool({ connection, wallet });
  };

  const onAddToWhitelist = async () => {
    await addToWhitelistTransaction({
      connection,
      wallet,
      communityPoolAddress,
      whitelistedAddress,
    });
  };

  const onAddToWhitelistOwner = async () => {
    await addToWhitelistOwner({
      connection,
      wallet,
      communityPoolAddress: communityPoolAddressOwner,
      whitelistedAddress: whitelistedAddressOwner,
    });
  };

  const onActivateCommunityPool = async () => {
    await activateCommunityPoolTransaction({
      connection,
      wallet,
      communityPoolAddress: activateCommunityPool,
    });
  };

  return (
    <AppLayout>
      <Container component="main">
        <Button onClick={onCreateCommunityPool}>Create Pool</Button>

        <h2 style={{ marginTop: 50 }}>Form to add nft in whitelist by mint</h2>
        <div style={{ display: 'flex' }}>
          <div
            style={{ marginTop: 50, display: 'flex', flexDirection: 'column' }}
          >
            <label>CommunityPool</label>
            <Input
              onChange={(e) => setCommunityPoolAddress(e.target.value)}
              value={communityPoolAddress}
            />
          </div>

          <div
            style={{ marginTop: 50, display: 'flex', flexDirection: 'column' }}
          >
            <label>whitelistedAddress</label>
            <Input
              onChange={(e) => setWhitelistedAddress(e.target.value)}
              value={whitelistedAddress}
            />
          </div>
          <Button onClick={onAddToWhitelist}>Submit</Button>
        </div>

        <h2 style={{ marginTop: 50 }}>Form to add nft in whitelist by owner</h2>
        <div style={{ display: 'flex' }}>
          <div
            style={{ marginTop: 50, display: 'flex', flexDirection: 'column' }}
          >
            <label>CommunityPool</label>
            <Input
              onChange={(e) => setCommunityPoolAddressOwner(e.target.value)}
              value={communityPoolAddressOwner}
            />
          </div>

          <div
            style={{ marginTop: 50, display: 'flex', flexDirection: 'column' }}
          >
            <label>whitelistedAddress</label>
            <Input
              onChange={(e) => setWhitelistedAddressOwner(e.target.value)}
              value={whitelistedAddressOwner}
            />
          </div>
          <Button onClick={onAddToWhitelistOwner}>Submit</Button>
        </div>

        <h2 style={{ marginTop: 50 }}>Form to activate community pool:</h2>
        <div style={{ display: 'flex' }}>
          <div
            style={{ marginTop: 50, display: 'flex', flexDirection: 'column' }}
          >
            <label>CommunityPool</label>
            <Input
              onChange={(e) => setActivateCommunityPool(e.target.value)}
              value={activateCommunityPool}
            />
          </div>
          <Button onClick={onActivateCommunityPool}>Activate</Button>
        </div>
      </Container>
    </AppLayout>
  );
};
