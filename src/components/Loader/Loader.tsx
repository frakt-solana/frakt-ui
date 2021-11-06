import { Spin, SpinProps as SpinProsAntd } from 'antd';

export const Loader = (props: SpinProsAntd): JSX.Element => {
  return <Spin {...props} />;
};
