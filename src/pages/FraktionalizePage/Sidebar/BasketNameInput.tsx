import { useEffect } from 'react';
import { Input } from '../../../components/Input';
import { useTokenListContext } from '../../../contexts/TokenList';

interface BasketNameInputProps {
  checkValidation?: boolean;
  basketName: string;
  setBasketName: (basketName: string) => void;
  error?: string;
  setError?: (error: string) => void;
  maxLength?: number;
}

export const BasketNameInput = ({
  checkValidation = true,
  basketName,
  setBasketName,
  error,
  setError,
  maxLength = 25,
}: BasketNameInputProps): JSX.Element => {
  const { tokenList } = useTokenListContext();

  const validate = (basketName: string) => {
    if (
      checkValidation &&
      ((basketName.length && basketName.length < 3) ||
        tokenList.find(({ name }) => name === basketName))
    ) {
      return setError("Invalid basket name or it's already in use");
    }

    setError('');
  };

  useEffect(() => {
    validate(basketName);

    return () => setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basketName]);

  return (
    <Input
      value={basketName}
      onChange={({ target }) => setBasketName(target.value)}
      placeholder="Coolest basket"
      error={!!error}
      maxLength={maxLength}
    />
  );
};
