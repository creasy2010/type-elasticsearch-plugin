/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/20
 **/

import {ISearchParamRule, types} from './search-type';
import {parseContent, getPosition, IPosition} from "./util";

export interface ICompletionEntry {
  name: string;
  insertText: string;
  comment?: string;
}

export interface ITipEntry{
  comment:string;
  start:number;
  end:number;
}

export function getQuickInfo(
  content: string,
  offset: number):ITipEntry{

  let result: ICompletionEntry[] = [];
  let urlAst = parseContent(content.trim());
  let position:IPosition = getPosition(urlAst,offset);

  //判断 是什么类型的
  let hitTypes = types.filter(searchTypeItem =>
    searchTypeItem.begin.startsWith(urlAst.begin)
  );

  if(hitTypes.length >0) {
      if(position.type==='begin') {
        return Object.assign({},urlAst.beginIndexZone,{comment:hitTypes[0].comment})
      } else {
        if(position.paramItem.keyIndex.start <offset   && offset>position.paramItem.valueIndex.end){

          let hitRule:ISearchParamRule =null;
          hitTypes[0].searchParamsRule.forEach(item=>{
            if(item.name === position.paramItem.name){
              hitRule= item;
            }
          });
          return Object.assign({},position.paramItem.keyIndex,{comment:hitRule.comment})
        }
      }
  }else{
    return ;
  }

}

/**
 *
 * @param {string} content  搜索字符串内容
 * @param {number} offset 光标所在位置,从0开始算
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

  if(hitTypes.length===0){
    //内容对不上时 全部返回. ;;
    return types.map(typeItem => {
      return {
        name: typeItem.begin,
        insertText: typeItem.beginReplace,
        comment: typeItem.comment
      };
    });
  }


  if(position.type === 'begin') {
      return hitTypes.map(typeItem => {
        return {
          name: typeItem.begin,
          insertText: typeItem.beginReplace,
          comment: typeItem.comment
        };
      });
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
      });

  }

  return result;
}
