import ReactDOM from 'react-dom';
import 'antd/dist/antd.dark.css';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/thumbs/thumbs.scss';
import 'swiper/modules/lazy/lazy.scss';

import App from './App';
import './scss/styles.scss';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
