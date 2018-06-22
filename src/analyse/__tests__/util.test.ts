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
  console.log(JSON.stringify(result));
  expect(result).toEqual({
    begin: '/products/A967550',
    beginIndexZone: {end: 17, start: 0},
    params: {
      from: {
        keyIndex: {end: 30, start: 26},
        name: '0',
        valueIndex: {end: 32, start: 31},
      },
      q: {
        keyIndex: {end: 19, start: 18},
        name: 'apple',
        valueIndex: {end: 25, start: 20},
      },
      size: {
        keyIndex: {end: 37, start: 33},
        name: '2',
        valueIndex: {end: 39, start: 38},
      },
    },
  });
});
