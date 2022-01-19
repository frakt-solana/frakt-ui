export const numberFormatterTotal = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatNumberTotal = {
  format: (val?: number): string | number => {
    if (!val) {
      return '--';
    }

    return numberFormatterTotal.format(val);
  },
};

export const formatPercent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const groupNumberBySpace = (formatAmount: string | number): string =>
  formatAmount.toString().replace(',', ' ');

export const formatTotalToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace(' ', ''));

export const formatAprToNumber = (formatAmount: number | string): number =>
  Number(formatAmount?.toString().replace('%', ''));
