/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/22
 **/
import {IUrlContent} from "./index";

/**
 /products/A967550?q=apple&from=0&size=2
 * @param {string} content
 */
export function parseContent(content: string = ""): IUrlContent {

  let temp = content.split('?');
  let begin = temp[0];
  let params = {};
  let beginIndexZone = {start: 0, end: begin.length};

  if (temp[1]) {
    let _temp = beginIndexZone.end + 1;
    temp[1].split('&').forEach(paramItem => {
      temp = paramItem.split('=');

      let keyIndex = {start: _temp, end: _temp + temp[0].length};
      let valueIndex = {start: keyIndex.end + 1, end: keyIndex.end + 1 + temp[1].length}

      params[temp[0]] = {
        name: temp[1],
        keyIndex,
        valueIndex
      };
      _temp = _temp + paramItem.length + 1;
    });
  }

  return {
    begin,
    beginIndexZone,
    params
  };
}