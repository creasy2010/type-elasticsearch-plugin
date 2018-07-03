/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/20
 **/
import {getCompleteEntry,getQuickInfo} from '../index';
//
it('空字符串时给出提示',async ()=>{
  let result  = getCompleteEntry(" ",1);
  expect(result).toMatchSnapshot("空字符串时给出提示");
});

//http://gitbook.dev.qianmi.com/OF1540/search_platform_book/book/standard_query_api.html
it('标准查询参数',async ()=>{

  expect(getCompleteEntry("/products/Axxxxxx?",0))
    .toMatchSnapshot("标准查询参数-sku");

  // expect(getCompleteEntry("/products/Axxxxxx?",0))
  //   .toMatchSnapshot("标准查询参数-sku");

  expect(getCompleteEntry("/",1))
    .toMatchSnapshot("开头查询");


  expect(getCompleteEntry("/aggregations/Axxxx?",20))
    .toMatchSnapshot("搜索关键字提示");
})



it('quickInfo', async()=>{

  expect(getQuickInfo("/products/Axxxxxx?q=aaaa",1))
    .toMatchSnapshot("quickInfo");

  expect(getQuickInfo("/products/Axxxxxx?q=aaaa",18))
    .toMatchSnapshot("quickInfo");

});