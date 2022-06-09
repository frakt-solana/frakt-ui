import { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const defaultColors = ['#83D6A4', '#3E9EF8', '#5D5FEF', '#4D4D4D'];

interface ChartPieProps {
  rawData?: any[];
  colors?: string[];
}

const ChartPie: FC<ChartPieProps> = ({ rawData, colors }) => {
  const data = {
    datasets: [
      {
        data: rawData,
        backgroundColor: colors?.length ? colors : defaultColors,
        borderColor: '#191919',
        borderWidth: 4,
      },
    ],
  };

  return <Pie data={data} />;
};

export default ChartPie;
