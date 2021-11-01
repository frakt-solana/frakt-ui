import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import styles from './styles.module.scss';

// const useUserTokens = () => {
//   const { wallet, connected } = useWallet();
//   const connection = useConnection();
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const fetchTokens = async () => {
//     setLoading(true);
//     const tokens = await getAllUserTokens(wallet.publicKey, { connection });

//     const a = await connection.getParsedProgramAccounts(
//       new PublicKey('D1bz9T4br5DaRfYx48aSaQsstcfuaytvvArxVjShLwca'),
//     );
//     console.log(a);
//   };

//   useEffect(() => {
//     connected && fetchTokens();
//   }, [connected]);
// };

const FraktionalizePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Container component="main" className={styles.content}>
        <p>Fraktionalize page</p>
      </Container>
    </AppLayout>
  );
};

export default FraktionalizePage;
