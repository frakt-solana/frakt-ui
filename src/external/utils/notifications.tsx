import { notification } from 'antd';

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function notify({
  message = '',
  description = null,
  type = 'info',
}): void {
  (notification as any)[type]({
    className: 'fraktion__notification',
    message,
    description,
    placement: 'bottomRight',
  });
}
