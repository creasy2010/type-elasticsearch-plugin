//子类型处理的不好. TODO  类型表示 也不够好, 自定义类型, 看看typescript是否可以做到
enum ValueTypeEnum {
  string, //""
  int,
  boolean,
  strWithComma, //'a,b,c'
  mapStrArray, // basic=brand:华为,小米;price:-1000,1500-2500,4000-
  mapStr, //stock:1;price:0
}

interface ISearchParamRule {
  name: string; //标识 , q
  type: ValueTypeEnum; // 值类型;
  isRequire: boolean; //是否必填;
  comment: string; //备注;
}

interface ISearchType {
  begin: string; //以什么开头
  beginReplace: string; //用什么替换;
  searchParamsRule: ISearchParamRule[];
  comment: string;
  requiredParams?:ISearchParamRule[]//必传的参数名称; 动态计算
}

enum FormatEnum {
  json = 'json',
  xml = 'xml',
  yaml = 'yaml',
}

const basicRuels: ISearchParamRule[] = [
  {name: 'q', type: ValueTypeEnum.string, comment: '搜索关键词', isRequire: false},
  {
    name: 'basic',
    type: ValueTypeEnum.mapStrArray,
    comment:
      '基础查询条件，不同查询条件之间用";"分割，同一查询条件下的值支持多选，用","分割；eg:basic=brand:华为,小米;price:-1000,1500-2500,4000-',
    isRequire: false,
  },
  {
    name: 'cats',
    type: ValueTypeEnum.strWithComma,
    comment: '商品类目路径，格式为："b2c,手机,手机数码"',
    isRequire: false,
  },
  {
    name: 'prop',
    type: ValueTypeEnum.mapStrArray,
    comment: '商品属性，格式同basic参数，为： "网络:移动4g,联通4g;颜色:白色,黑色"',
    isRequire: false,
  },
  {
    name: 'from',
    type: ValueTypeEnum.int,
    comment: '起始条数，非分页数，默认为0，最大为6000',
    isRequire: false,
  },
  {
    name: 'size',
    type: ValueTypeEnum.int,
    comment: '查询条数，默认为60，最大为200',
    isRequire: false,
  },
  {
    name: 'sort',
    type: ValueTypeEnum.mapStr,
    comment:
      '对搜索结果进行排序，可不填，默认值为匹配得分降序，即_score:0。1表示升序、0表示降序，支持多个排序字段。格式为："stock:1;price:0"，表示首先按照库存升序，然后按照价格降序对搜索结果进行排序',
    isRequire: false,
  },
  {
    name: 'format',
    type: ValueTypeEnum.string,
    comment: '返回数据的格式，支持json、xml、yaml，默认json；也可以在HTTP header accept参数中指定返回消息格式',
    isRequire: false,
  },
  {
    name: 'ownerFilter',
    type: ValueTypeEnum.int,
    comment: '用于开启或关闭自营商品查询过滤，为1表示仅查询自营商品，为0表示查询所有的商品，默认值为1',
    isRequire: false,
  },
];

//类型判断逻辑;;
//1.begin
//2.查询参数

let skuSearch: ISearchType = {
  begin: '/products/',
  beginReplace: '/products/:adminId',
  searchParamsRule: basicRuels.concat([]),
  comment: '商品SKU查询,根据指定的查询条件返回符合条件商品，支持分页和排序。',
};

let spuSearch: ISearchType = {
  begin: '/spus/',
  beginReplace: '/spus/:adminId',
  searchParamsRule: basicRuels.concat([]),
  comment: '商品SPU查询,根据指定的查询条件返回符合条件商品，支持分页和排序。',
};

let sku4spuSearch: ISearchType = {
  begin: '/products/',
  beginReplace: '/products/:adminId',
  searchParamsRule: basicRuels.concat([
    {
      name: 'scene',
      type: ValueTypeEnum.string,
      comment: '用于开启或关闭自营商品查询过滤，为1表示仅查询自营商品，为0表示查询所有的商品，默认值为1',
      isRequire: true,
    },
  ]),
  comment: '根据查询条件查询SKU，但是结果聚合成SPU的方式',
};

//聚合
const skuAggRule = basicRuels.concat([
  {
    name: 'props_agg_ignore_cat',
    type: ValueTypeEnum.boolean,
    comment: '是否忽略类目的限制，默认只有到最小类目才会聚合属性，如果为true的话表示不限制',
    isRequire: false,
  },
]);

let agg4sku: ISearchType = {
  begin: '/aggregations/',
  beginReplace: '/aggregations/:adminId',
  searchParamsRule: skuAggRule,
  comment: '根据查询条件聚合商品SKU信息。',
};

let agg4spu: ISearchType = {
  begin: '/spu_aggregations/',
  beginReplace: '/spu_aggregations/:adminId',
  searchParamsRule: skuAggRule,
  comment: '根据查询条件聚合商品SKU信息。',
};

const searchRule = basicRuels.concat([
  {
    name: 'res',
    type: ValueTypeEnum.string,
    comment:
      '搜索资源， 可取值products、aggregations，products表示商品资源，aggregations表示商品聚合结果。res=products,aggregation表示同时获取商品和商品聚合结果。res不填默认为products。',
    isRequire: false,
  },
]);

let searchSku: ISearchType = {
  begin: '/search/',
  beginReplace: '/search/:adminId',
  searchParamsRule: searchRule,
  comment: '根据查询条件聚合商品SKU信息。',
};

let searchSpu: ISearchType = {
  begin: '/spu_search/',
  beginReplace: '/spu_search/:adminId',
  searchParamsRule: searchRule,
  comment: '根据查询条件查询商品SPU信息和SPU聚合结果。',
};

let searchSku4Spu: ISearchType = {
  begin: '/search/',
  beginReplace: '/search/:adminId',
  searchParamsRule: searchRule.concat([
    {
      name: 'scene',
      type: ValueTypeEnum.string,
      comment: '用于开启或关闭自营商品查询过滤，为1表示仅查询自营商品，为0表示查询所有的商品，默认值为1',
      isRequire: true,
    },
  ]),
  comment: '根据查询条件查询商品SPU信息和SPU聚合结果。',
};

let suggestGoods: ISearchType = {
  begin: '/suggests/',
  beginReplace: '/suggests/:adminId',
  searchParamsRule: [
    {name: 'q', type: ValueTypeEnum.string, comment: '搜索关键词', isRequire: true},
    {
      name: 'size',
      type: ValueTypeEnum.int,
      comment: '关键词数目，默认为10，最大为50',
      isRequire: false,
    },
    {
      name: 'size',
      type: ValueTypeEnum.int,
      comment: '查询条数，默认为60，最大为200',
      isRequire: false,
    },
    {
      name: 'format',
      type: ValueTypeEnum.string,
      comment:
        '返回数据的格式，支持json、xml、yaml，默认json；也可以在HTTP header accept参数中指定返回消息格式',
      isRequire: false,
    },
  ],
  comment: '商品搜索提示作为关键词智能提示。',
};

export const types: ISearchType[] = [
  suggestGoods,
  searchSku4Spu,
  searchSpu,
  searchSku,
  agg4spu,
  agg4sku,
  sku4spuSearch,
  spuSearch,
  skuSearch,
].map(searchItem=>{
   searchItem.requiredParams = searchItem.searchParamsRule.filter(paramRule=>paramRule.isRequire);
   return searchItem;
});
