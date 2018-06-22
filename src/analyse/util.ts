/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/22
 **/
//TODO 应该解析为ast进行分析;

/// q=apple& 与  cats='a,b,c' 如何区分?
export interface IParamItem{
  name:string;
  keyIndex:{start:number,end:number}
  valueIndex:{start:number,end:number};
}

export interface IUrlContent {
  begin: string; ///products
  beginText: string; ///products/A967550
  beginIndexZone:{start:number,end:number}
  params: IParamItem[];
}



/**
 /products/A967550?q=apple&from=0&size=2
 * @param {string} content
 */
export function parseContent(content: string = ""): IUrlContent {

  let temp = content.split('?');
  let begin = "/"+(temp[0].split("/")[1]|| "");
  let beginText= temp[0];
  let params = [];
  let beginIndexZone = {start: 0, end: begin.length};

  if (temp[1]) {
    let _temp = beginIndexZone.end + 1;
    temp[1].split('&').forEach(paramItem => {
      temp = paramItem.split('=');

      let keyIndex = {start: _temp, end: _temp + temp[0].length};
      let valueIndex = {start: keyIndex.end + 1, end: keyIndex.end + 1 + temp[1].length}
      params.push({
        name: temp[1],
        keyIndex,
        valueIndex
      });
      _temp = _temp + paramItem.length + 1;
    });
  }

  return {
    begin,
    beginText,
    beginIndexZone,
    params
  };
}


export interface IPosition {
  type:"begin"|"param",
  paramItem?:IParamItem,//param 类型的才有此值;
}

export function getPosition(urlContent:IUrlContent,offset:number):IPosition{

  //头部类型判断
  if(urlContent.beginIndexZone.start <= offset && offset <urlContent.beginIndexZone.end){
    return {type:"begin"}
  }

  //尾部类型判断;

  let paramItem = urlContent.params.filter(paramItem=>paramItem.keyIndex.start <= offset && paramItem.valueIndex.end >offset )[0]
  if(paramItem){
    return {type:"param",paramItem}
  }else{
    return {type:"begin"}
  }
}