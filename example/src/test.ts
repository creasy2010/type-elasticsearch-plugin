/**
 * @desc
 * 搜索引擎参数构造助手 使用演示;;
 *
 **/
// import { esClient } from './es-client';

let a = esClient`/search/123123123?q=sdfsdf&cats=223123&basic=sdfsdfwer&ex_q_属性名=bterms(值1,值2,值3)`;

//  let a = esClient`/search/123123123?q=sdfsdf&cats=223123&basic=sdfsdfwer&ex_q_属性名=bterms(值1,值2,值3)`;

export function esClient(string1) {
  console.log(string1);
}
