/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/20
 **/
import {parseContent} from '../util';

it('切割内容', async () => {
  let result = parseContent('/products/A967550?q=apple&from=0&size=2');
  expect(result).toEqual({"begin": "/products", "beginIndexZone": {"end": 9, "start": 0}, "beginText": "/products/A967550", "params": [{"keyIndex": {"end": 11, "start": 10}, "name": "apple", "valueIndex": {"end": 17, "start": 12}}, {"keyIndex": {"end": 22, "start": 18}, "name": "0", "valueIndex": {"end": 24, "start": 23}}, {"keyIndex": {"end": 29, "start": 25}, "name": "2", "valueIndex": {"end": 31, "start": 30}}]});
});
