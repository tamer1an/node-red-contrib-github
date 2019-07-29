import { h } from 'preact';
import style from './style';
import * as list from '../../assets/s';

const mapData = list =>
  list.map((v, i) => (<li>{i} - <a target="_blank" href={v}>{v}</a></li>));

const filterEvent = (e) => {
  console.log(e);
};

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p><input type="text" name="filter" onChange={filterEvent}/></p>
    <ul>
      {mapData(list)}
    </ul>
	</div>
);

export default Home;
