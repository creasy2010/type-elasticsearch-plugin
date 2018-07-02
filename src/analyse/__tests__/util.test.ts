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
  expect(result).toMatchSnapshot("切割内容");
});
