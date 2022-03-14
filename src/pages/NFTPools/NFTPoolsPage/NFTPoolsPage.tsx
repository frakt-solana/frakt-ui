import { FC, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { ArrowDownSmallIcon } from '../../../icons';
import { Select } from '../../../components/Select/Select';
import { Sidebar } from './components/Sidebar';
import { PoolsList } from './components/PoolsList';
import { AppLayout } from '../../../components/Layout/AppLayout';
import {
  useNftPools,
  useNftPoolsInitialFetch,
  useNftPoolsPolling,
} from '../../../contexts/nftPools';
import styles from './NFTPoolsPage.module.scss';
import { Loader } from '../../../components/Loader';
import { CommunityPoolState } from '../../../utils/cacher/nftPools';
import { Container } from '../../../components/Layout';

export const NFTPoolsPage: FC = () => {
  const { control /* watch */ } = useForm({
    defaultValues: {
      sort: SORT_VALUES[0],
    },
  });

  // const sort = watch('sort');

  const { pools: rawPools, loading } = useNftPools();
  useNftPoolsInitialFetch();
  useNftPoolsPolling();

  const pools = useMemo(() => {
    return rawPools.filter(
      ({ state, publicKey }) =>
        state === CommunityPoolState.ACTIVE &&
        publicKey.toBase58() === '4wL5ftfJV6HxC5QoYc2C6jUAdDAVQM8tX7JkWRouUAB8',
    );
  }, [rawPools]);

  return (
    <AppLayout className={styles.layout}>
      <Container>
        <div className={styles.wrapper}>
          <Sidebar />

          <div className={styles.content}>
            <h1 className={styles.title}>Pools</h1>
            <h2 className={styles.subtitle}>
              Buy, sell, and swap NFTs instantly
            </h2>

            <div className={styles.searchWrapper}>
              <Input
                className={styles.searchInput}
                placeholder="Search pools"
                prefix={<SearchOutlined className={styles.searchIcon} />}
              />
              <div className={styles.sortWrapper}>
                <Controller
                  control={control}
                  name="sort"
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      className={styles.sortingSelect}
                      valueContainerClassName={
                        styles.sortingSelectValueContainer
                      }
                      label="Sort by"
                      name="sort"
                      options={SORT_VALUES}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            {loading ? <Loader size="large" /> : <PoolsList pools={pools} />}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

const SORT_VALUES = [
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'collectionName_asc',
  },
  {
    label: (
      <span className={styles.sortName}>
        Name <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'collectionName_desc',
  },
];
