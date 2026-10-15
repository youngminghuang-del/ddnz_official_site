import {useLocation} from 'react-router-dom';
import SEO from '../../components/SEO';
import Footer from '../../components/Footer';
import SourcingHomepageNav from '../../components/SourcingHomepageNav';
import UsedGoodsContent, {usedGoodsMetadata, type UsedGoodsCountry} from './UsedGoodsContent';
import {gulfLocaleFromPath} from './gulfLocale';
import './freight.css';
import './gulf-stories.css';
import './used-goods.css';
import './used-goods-port-map.css';
export default function UsedGoodsPage(){
 const {pathname}=useLocation();
 const country=pathname.replace(/\/$/,'').split('shipping-from-china-to-').pop() as UsedGoodsCountry;
 const locale=gulfLocaleFromPath(pathname), data=usedGoodsMetadata(country,locale);
 return <div className="ddnz-home"><SEO title={data.title} description={data.description}/><SourcingHomepageNav showFreightExecutor/><UsedGoodsContent country={country} locale={locale}/><Footer/></div>;
}
