/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/20
 **/

import {types} from './search-type';

export interface ICompletionEntry {
  name: string;
  insertText: string;
  comment?: string;
}

/**
 *
 * @param {string} content  搜索字符串内容
 * @param {number} offset 光标所在位置
 * @returns {ICompletionEntry[]}
 */
export function getCompleteEntry(
  content: string,
  offset: number,
): ICompletionEntry[] {
  //内容为空时处理
  if (content.trim().length === 0) {
    return types.map(typeItem => {
      return {
        name: typeItem.begin,
        insertText: typeItem.beginReplace+"?",
        comment: typeItem.comment,
      };
    });
  }

  let result: ICompletionEntry[] = [];
  let urlAst = parseContent(content.trim());

  //判断 是什么类型的
  let hitTypes = types.filter(searchTypeItem => urlAst.begin.startsWith(searchTypeItem.begin));

  // let paramItemIndex= preStr.lastIndexOf("&");
  // let paramIndex= preStr.lastIndexOf("?");
  // let equalIndex= preStr.lastIndexOf("=");
  //TODO 根据所在位置添加 不同信息


  let preStr = content.substring(0, offset + 1);
  let storedName = [];
  hitTypes.forEach(searchTypeItem=>{
    searchTypeItem.searchParamsRule.forEach(ruleItem=>{
      if(!storedName.includes(ruleItem.name)) {
        result.push({
          name:ruleItem.name,
          insertText:ruleItem.name+"=",
          comment:ruleItem.comment
        })
        storedName.push(ruleItem.name);
      }
    })
  })


  return result;
}

//TODO 应该解析为ast进行分析;

/// q=apple& 与  cats='a,b,c' 如何区分?
export interface IUrlContent {
  begin: string; ///products/A967550
  params: {
    [name: string]: string;
  };
}
/**
  /products/A967550?q=apple&from=0&size=2


 * @param {string} content
 */
function parseContent(content: string): IUrlContent {
  let temp = content.trim().split('?');
  let begin = temp[0];
  let params = {};
  temp[1].split('&').forEach(paramItem => {
    temp = paramItem.split('=');
    params[temp[0]] = temp[1];
  });

  return {
    begin,
    params,
  };
}
