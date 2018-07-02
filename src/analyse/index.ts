/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/20
 **/

import {types} from './search-type';
import {parseContent, getPosition, IPosition} from "./util";

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
  offset: number
): ICompletionEntry[] {
  let result: ICompletionEntry[] = [];
  let urlAst = parseContent(content.trim());
  let position:IPosition = getPosition(urlAst,offset);

  //判断 是什么类型的
  let hitTypes = types.filter(searchTypeItem =>
    searchTypeItem.begin.startsWith(urlAst.begin)
  );

  // console.log(`position:${JSON.stringify(position)},urlAst:${JSON.stringify(urlAst)},hitTypes.length:${hitTypes.length},offset:${offset}`);
  if(position.type === 'begin') {
    if(hitTypes.length>0) {
      return hitTypes.map(typeItem => {
        return {
          name: typeItem.begin,
          insertText: typeItem.beginReplace + '?',
          comment: typeItem.comment
        };
      });
    } else {
      //内容对不上时 全部返回. ;;
      return types.map(typeItem => {
        return {
          name: typeItem.begin,
          insertText: typeItem.beginReplace + '?',
          comment: typeItem.comment
        };
      });
    }

  } else if(position.type === 'param') {

    let storedName = [];
    hitTypes.forEach(searchTypeItem => {
      //把类型中的查询参数取出来
      searchTypeItem.searchParamsRule.forEach(ruleItem => {
        if (!storedName.includes(ruleItem.name)) {
          result.push({
            name: ruleItem.name,
            insertText: ruleItem.name + '=',
            comment: ruleItem.comment
          });
          storedName.push(ruleItem.name);
        }
      });
    })
  }

  return result;
}
