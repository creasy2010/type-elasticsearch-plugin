//子类型处理的不好. TODO  类型表示 也不够好, 自定义类型, 看看typescript是否可以做到
export enum ValueTypeEnum {
  string, //""
  int,
  boolean,
  strWithComma,//'a,b,c'
  mapStrArray, // basic=brand:华为,小米;price:-1000,1500-2500,4000-
  mapStr,      //stock:1;price:0
  other,
}


export interface ISearchParamRule {
  name: string; //标识 , q
  insertText?: string; //标识 , q
  type: ValueTypeEnum; // 值类型;// 有valueRules 后就没有type了. 因为可以再次解析 了
  isRequire?: boolean; //是否必填; 默认为false
  comment: string; //备注;
  //子项的规则;
  valueRules?:ISearchParamRule[]
}

export  interface ISearchType {
  begin: string; //以什么开头
  beginReplace: string; //用什么替换;
  searchParamsRule: ISearchParamRule[];
  comment: string;
  requiredParams?:ISearchParamRule[]//必传的参数名称; 动态计算
}

export enum FormatEnum {
  json = 'json',
  xml = 'xml',
  yaml = 'yaml',
}

//自定义查询 http://gitbook.dev.qianmi.com/OF1540/search_platform_book/book/extend_query_api.html
const customQuery:ISearchParamRule[] = [
  {
    name: 'ex_highlight_属性名',
    insertText:"ex_highlight_属性名=highlight(pre_tags:<red>,post_tags:</red>,q:苹果,multi_field:title.standard)",
    type: ValueTypeEnum.other,
    comment:
      `属性名: 需要高亮的字段名称，返回的数据结构中该字段会高亮显示关键词
       pre_tags:高亮词起始标签，默认值为"<hl>"
       post_tags:高亮词结束标签，默认值为"</hl>"
       q:需要高亮的关键词，一般不填，默认为查询关键词
       multi_field:针对一个属性对应搜索平台多个字段，搜索平台无法自动匹配，这时需要手工选择一个字段。目前商品标题就是这种情况，如果是标题高亮的话需要将该字段设为"title.standard"
      `,
    isRequire: false,
  },

  {
    name: 'ex_fields',
    insertText:"ex_fields=属性1,属性2,属性3",
    type: ValueTypeEnum.other,
    comment:
      `属性名:需要查询的属性，支持多个属性，属性之间用","分隔。只会返回文档中实际存在的字段，即字段如果有错误或者不存在，可以正常返回。
      `,
    isRequire: false,
  },
  {
    name: 'ex_script_field_动态属性名',
    insertText:"ex_script_field_动态属性名=doc[salePrice].value-doc[costPrice].value",
    type: ValueTypeEnum.other,
    comment:
      `属性名:动态属性，返回的值就放在这个属性中
      动态脚本:doc表示整个文档，可以通过doc.salePrice或者doc[salePrice]的方式访问文档salePrice属性，属性.value表示属性的值
            eg: pow(doc.salePrice.value,2),doc.salePrice.value-doc.costPrice.value =doc[salePrice].value-doc[costPrice].value
      `,
    isRequire: false,
  },
  {
    name: 'ex_q_属性名',
    insertText:"ex_q_属性名=terms(值1,值2,值3)",
    type: ValueTypeEnum.other,
    comment:
      `属性名:要进行查询的字段
      `,
    isRequire: false,
    valueRules:[
      {
        name: 'terms',
        insertText:"terms(值1,值2,值3)",
        type: ValueTypeEnum.other,
        comment:"terms:terms(值1,值2,值3)支持多个值，值之间用\",\"分隔，多个值之间是or关系,建议使用bterms;",
      }, {
        name: 'bterms',
        insertText:"bterms(值1,值2,值3)",
        type: ValueTypeEnum.other,
        comment:"bterms(值1,值2,值3):支持多个值，值之间用\",\"分隔，多个值之间是or关系，null用\"\\null\\\"表示;",
      }, {
        name: 'size_terms',
        insertText:"size_terms(value:值1,值2,值3;size:0)",
        type: ValueTypeEnum.other,
        comment:"size_terms(value:值1,值2,值3;size:0):对数组或者list字段来说，terms查询多个值之间是or关系，只要数组中的值满足一个查询值即满足查询请求。size_terms可以指定匹配值的个数，字段必须满足匹配数才算满足查询条件。\n以商品为例：商品中的productLine(产品线)是array字段，值1：云商城，2：云订货，3：云小店，4：云供货，一个商品可以属于多个产品线",
      }, {
        name: 'range',
        insertText:"range(-200,500-1200,3333-)",
        type: ValueTypeEnum.other,
        comment:"range(-200,500-1200,3333-):range查询根据指定的区间对文档进行查询，range查询只能作用于数值，支持多个区间，多个区间之间是or关系。区间采用左闭右开的原则。 比如查询商品销售价格在[200, 500)和[3000, ⑅)范围的商品就可以用range查询,range(-200,500-1200,3333-)",
      }, {
        name: 'match(值)',
        insertText:"match(值)",
        type: ValueTypeEnum.other,
        comment:"match(值):用match查询给定值，在遇到数字，日期，布尔值或者not_analyzed的字符串时，都返回和给定值相同的文档，等同于sql的\"=\"",
      }, {
        name: 'multi_match()',
        insertText:"multi_match()(值)",
        type: ValueTypeEnum.other,
        comment:"multi_match():multi_match查询允许在match查询的基础上同时搜索多个字段，即将相同的match查询作用在多个字段上，可以指定多个字段之间的逻辑关系，如果关系为and，则要所有字段都匹配，如果关系为or，只要有一个字段符合即可",
      }, {
        name: 'ematch',
        insertText:"ematch()",
        type: ValueTypeEnum.other,
        comment:"ematch:extend match(扩展match， ematch)允许在match查询的基础上设置查询值分词后的结果的逻辑关系。如果关系为and，则要所有词条都匹配，如果关系为or，只要有一个词条匹配即可",
      },{
        name:'query_string',
        insertText:"query_string(query:华为手机;minimum_should_match:2;default_operator:or;analyzer:qm_standard)",
        type: ValueTypeEnum.other,
        comment:`query[string]:要查询的值;
        default_operator[string]:词条匹配结果的逻辑计算方式，可选值：and、or；默认值or;
        minimum_should_match[int]:多个词条的匹配数目，当operator为or是生效，默认值为1
        analyzer[string]:分词器，一般使用千米自定义分词器qm_standard
        `
      }, {
        name: 'more_like_this',
        insertText:"more_like_this(like_text:华为手机;analyzer:qm_standard)",
        type: ValueTypeEnum.other,
        comment:`more_like_this查询可以获取和所提供的文本相似的文档，可以通过具体的参数调整文本相似度。支持对多个字段进行查询。
          like_text[string]:文档要比较的内容;
          default_operator[string]:词条匹配结果的逻辑计算方式，可选值：and、or；默认值or;
          minimum_should_match[int]:多个词条的匹配数目，当operator为or是生效，默认值为1;
          analyzer[string]:分词器，一般使用千米自定义分词器qm_standard;
        `,
      }, {
        name: 'prefix',
        insertText:"prefix(prefix:华为手机;boost:1.0;rewrite:constant_score_auto)",
        type: ValueTypeEnum.other,
        comment:`prefix查询(前缀查询)可以获取某个字段以给定的前缀开始的文档。例如，想查询所有titile字段以"苹果"开始的文档就可以使用prefix查询。
                 prefix查询的字段必须是没有分词的字段(not analyzed).
                 
                 prefix[string]:文档字段要查询的前缀
                 boost[double]:得分权重，可不填，默认为1.0
                 rewrite[string]:查询重写属性，可选值：constant_score_auto、constant_score_boolean、constant_score_filter、scoring_boolean、top_terms_N、top_terms_boost_N，默认为 constant_score_auto
        `,
      },{
        name: 'regexp',
        insertText:"regexp(value:.+手机;boost:1.0;flags:ALL;max_determinized_states:10000)",
        type: ValueTypeEnum.other,
        comment:`regexp查询(正则表达式查询)可以查询某个字段是否符合给定的正则表达式，正则表达式查询属于非常消耗资源的查询，原则上不允许业务使用
        value[string]:要匹配的正则表达式
        boost[double]:得分权重，默认为1.0
        flags[string]:默认值为 ALL
        max_determinized_states[int]:默认值为 10000
        `,
      }
      ,{
        name: 'wildcard',
        insertText:"wildcard(value:*手机;boost:1.0)",
        type: ValueTypeEnum.other,
        comment:"wildcard查询(通配符查询)类似于terms查询，不过支持通配符\"*\"(任意字符)、\"?\"(单个字符)查询，语法和功能上类似于SQL中的like查询，部分wildcard查询属于非常消耗资源的查询，需要慎用。",
      },{
        name: 'span_first',
        insertText:"span_first(value:手机;end:5;boost:1.0)",
        type: ValueTypeEnum.other,
        comment:`
              参数名	数据类型	可需	描述
              属性名	string	必填	要进行查询的字段
              value	string	必填	要查询的值
              end	int	必填	字段前几个词条参与匹配
              boost	double	选填	得分权重，可不填，默认为1.0
        `,
      },{
        name: 'span_near',
        insertText:"span_near(value:手机,6s;slot:1;boost:1.0)",
        type: ValueTypeEnum.other,
        comment:`span_near查询也属于跨度查询，可以在有多个其它跨度彼此接近时对文档进行检索，该查询也是一个能够将其它跨度查询包装起来的复合查询。比如我们可以使用span_near查询"手机"词条附近有"6s"词条的文档。
                  属性名	string	必填	要进行查询的字段
                  value	string	必填	要查询的值
                  slot	int	必填	跨度之间允许的其它词条数
                  boost	double	选填	得分权重，可不填，默认为1.0
        `,
      },{
        name: 'stock',
        insertText:"stock(range:-10,20-60,70-;region:nanjing,field:stock)",
        type: ValueTypeEnum.other,
        comment: `stock库存查询主要是查询商品库存，支持区域库存和库存范围查询。
        参数名	数据类型	可需	描述
        属性名	string	必填	要进行查询的字段
        range	string	必填	要查询的库存区间，有货的话用"1-"即可
        region	string	选填	区域库存，如果不填的话表示全局库存
        field	string	选填	存放库存数目的字段名称，默认值为"stock"
        `,
      },{
        name: 'nested',
        insertText:"nested(field:a|b;query:<嵌套实体子查询>)",
        type: ValueTypeEnum.other,
        comment:`nested查询用于对字段是嵌套类型的文档的查询。商品的类目是嵌套类型，要对类目进行查询就必须要用nested查询
                参数名	数据类型	可需	描述
                属性名	string	必填	要进行查询的字段
                query	string	必填	存放嵌套查询的实体子查询
                field	string	必填	路径名，如果中间有多层路径则放在path中,用"	
        `,
      },{
        name: 'date_range',
        insertText:"date_range(--2016-10-13T18:07:44+0800,2016-10-13--2016-10-15T18:07:44,2016-06-13--)",
        type: ValueTypeEnum.other,
        comment:`date_range查询根据指定的区间对文档进行查询，date_range查询只能作用于日期字段，支持多个区间，多个区间之间是or关系。区间采用左闭右开的原则。
        参数名	数据类型	可需	描述
        属性名	string	必填	要进行查询的字段，该字段必须是date类型
        范围	string	必填	支持多个区间，区间之间用","分隔，区间之间是or关系。区间左闭右开，格式为"2016-10-13T18:07:44+0800--"、"2016-10-13--2016-10-15T18:07:44" 、"2016-06-13--"，区间上下边界之间用"--"分隔，时间的格式支持："2016-10-13" "2016-10-13T18:07:44" "2016-10-13T18:07:44+0800" "now"
`,
      },{
        name: 'not',
        insertText:"not(query:<子查询1>|<子查询2>)",
        type: ValueTypeEnum.other,
        comment:`not查询用于对查询取反。比如查询商品标题中不含有"苹果"时就可以对标题含有苹果的查询取反。
        参数名	数据类型	可需	描述
        query	string	必填	存放not查询的实体查询，支持多个子查询，子查询之间用"Ι"分隔
        `,
      },{
        name: 'null',
        insertText:"null(flag:false)",
        type: ValueTypeEnum.other,
        comment:`null过滤用于查询字段是否为null。null过滤属于filter，查询结果不会对得分和聚合产生影响。
          根据user字段查询：
          
          返回true的情况：{ "user": "jane" }、{ "user": "" }、 { "user": "-" } 、{ "user": ["jane"] } 、{ "user": ["jane", null ] }
          返回false的情况：{ "user": null }、{ "user": [] }、 { "user": [null] }、 { "foo": "bar" }
          参数名	数据类型	可需	描述
          属性名	string	必填	要进行查询的字段
          flag	bool	选填	主要是决定是null还是not null， true表示是null查询；false表示not null查询。默认为false
        `,
      }
    ]
  },
  {
    name: 'ex_q_or',
    insertText:"ex_q_or=or(query:<子查询1>|<子查询2>)",
    type: ValueTypeEnum.strWithComma,
    comment:
      `存放or查询的实体查询，支持多个子查询，子查询之间用"Ι"分隔
      `,
    isRequire: false,
  },  {
    name: 'ex_q_not',
    insertText:"ex_q_not=not(query:<子查询1>|<子查询2>)",
    type: ValueTypeEnum.strWithComma,
    comment:
      `null过滤用于查询字段是否为null。null过滤属于filter，查询结果不会对得分和聚合产生影响。根据user字段查询：
      `,
    isRequire: false,
  },
  {
    name: 'ex_f_属性名',
    insertText:"ex_f_属性名=null(flag:false)",
    type: ValueTypeEnum.strWithComma,
    comment:
      `null:not查询用于对查询取反。比如查询商品标题中不含有"苹果"时就可以对标题含有苹果的查询取反。
       geo_distance:geo_distance过滤针对地理坐标类型字段，可以查询距离指定坐标在指定范围内的文档。
       geo_distance_range:geo_distance过滤针对地理坐标类型字段，可以查询距离指定坐标在指定范围内的文档。
       geo_bounding_box:geo_bounding_box过滤针对地理坐标类型字段，可以查询坐标在指定的矩形区域内的文档。
      `,
    isRequire: false,
    valueRules:[{
      name: 'geo_distance',
      insertText:"geo_distance(location:120.11,44.3;distance:150km)",
      type: ValueTypeEnum.other,
      comment:`
      geo_distance过滤针对地理坐标类型字段，可以查询距离指定坐标在指定范围内的文档。
      
      参数名	数据类型	可需	描述
      location	string	必填	地理坐标，采用经纬度方式
      distance	string	必填	距离，带单位，单位有km、m、cm、mm、mi、yd、ft等
      
      `,
    },{
      name: 'geo_distance_range',
      insertText:"geo_distance_range(location:120.11,44.3;from:150km;to:500km)",
      type: ValueTypeEnum.other,
      comment:`geo_distance过滤针对地理坐标类型字段，可以查询距离指定坐标在指定范围内的文档。和geo_distance过滤不同的是可以指定一个距离区间。
            属性名	string	必填	要进行查询的字段
            location	string	必填	地理坐标，采用经纬度方式
            from	string	必填	距离区间起始值，带单位，单位有km、m、cm、mm、mi、yd、ft等
            to	string	必填	距离区间结束值，带单位，单位有km、m、cm、mm、mi、yd、ft等
      `,
    },{
      name: 'geo_bounding_box',
      insertText:"geo_bounding_box(top_left:12.0,2.35;bottom_right:55,66)",
      type: ValueTypeEnum.other,
      comment:`
      geo_bounding_box过滤针对地理坐标类型字段，可以查询坐标在指定的矩形区域内的文档。
     
      参数名	数据类型	可需	描述
      属性名	string	必填	要进行查询的字段
      top_left	string	必填	矩形左上角地理坐标，采用经纬度方式
      bottom_right	string	必填	矩形右下角地理坐标，采用经纬度方式`,
    }]
  },
  {
    name: 'ex_q_ids',
    insertText:"ex_q_ids=ids(ID值1,ID值2,ID值3)",
    type: ValueTypeEnum.strWithComma,//TODO 类型不正确了. . 是方法的调用了
    comment:
      `属性名:动态属性，返回的值就放在这个属性中
      动态脚本:doc表示整个文档，可以通过doc.salePrice或者doc[salePrice]的方式访问文档salePrice属性，属性.value表示属性的值
            eg: pow(doc.salePrice.value,2),doc.salePrice.value-doc.costPrice.value =doc[salePrice].value-doc[costPrice].value
      `,
    isRequire: false,
  },
];

let items:ISearchParamRule[] =[
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

const basicRuels: ISearchParamRule[] = items.concat(customQuery);

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
