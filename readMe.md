
## target !

搜索引擎服务在业务线中重要性越来越大,不仅降低中心的复杂,也赋予客户端极大的灵活性;

搜索引擎服务暴露出http接口,供客户端调用; 但客户端在调用时,会做一层dsl封装,但封装后又转换为字符串发起http请求;

反复想来都觉得有些多余;就好比, 我们在用程序去表示SQL语句,各种组合 各种逻辑处理,最后又生成字符串的SQL执行查询;


```typescript
Java|node DSL => string;
```

当然,这样做,可以实现功能,但问题在于:

* 理解两份文档: 调用方不仅要明白搜索引擎的文档,而且要明白封装库文档及使用方法;
* 多余工作量还要保持同步: 搜索引擎是一个独立的服务,但现在我们要在搜索引擎上再次封装,一但搜索引擎有变化,库就要跟着变,不变则调用不了.;


反过来想为什么不直接发送http请求:不做任何封装,直接编辑 字符串? 这样当然是有问题的, 问题在于

* 结构不清晰,可能会调用出错,不易维护;
* 编辑的是字符串,很容易写错;
* 逻辑拼装比较难看;

那么如果 我们有语法检查, 有代码提示的能力呢? 就像在sql编辑器中写一个sql一样

just try it !

## 示例
!(demo)[./demo.gif]


### 调用实例:

```txt

http://192.168.XX.XX:18082/products/A967550?q=apple&from=0&size=2
http://192.168.XX.XX:18082/aggregations/A967550?q=apple&cats=b2c,设备耗材,数码通讯类,电脑/电脑周边
http://192.168.XX.XX:18082/search/A967550?q=apple&cats=b2c,设备耗材,数码通讯类,电脑/电脑周边&size=1&res=products,aggregations
http://192.168.XX.XX:18082/suggests/A967550?q=ap
http://127.0.0.1:8001/products/sptest?q=华为手机&ex_fields=spuId,skuId,title,salePrice&ex_script_field_doublePrice=doc[salePrice].value*2
http://192.168.XX.XX:18082/products/A967550?ex_q_skuId=bterms(g781407,g642997)
http://192.168.XX.XX:18082/products/A967550?ex_q_productLine=size_terms(value:1,2)
http://192.168.XX.XX:18082/products/A967550?ex_q_ids=ids(g781407,g642997)
http://192.168.XX.XX:18082/aggregations/A967550?q=酒&ex_section_salePrice=section(size:6,optimize:false)
http://192.168.XX.XX:18082/products/A967550?q=苹果&ex_body_type=count

#线上查询 fromlogserver
search/A2445267?ex_section_salePrice=section(size:6,optimize:false)&ex_q_D2COnSale=bterms(true)&ex_agg_cats=cats(depth:3)&props_agg_ignore_cat=true&ex_q_itemType=bterms(1,2,5)&ex_q_or=or(query:<ex_q_spuId=bterms(11334277,4375188,11334266,4375565,11334276,4375447,4375812,11334292,11334373,4375868)>|<ex_q_sourceSpuId=bterms(11334277,4375188,11334266,4375565,11334276,4375447,4375812,11334292,11334373,4375868)>)&ex_q_d2cBlockedLevels=null(flag:true)&ex_agg_d2cLabel=terms(size:0)&ownerFilter=0&from=0&size=200&sort=price:1
search/A1604919?res=products,aggregations&ex_agg_cats=cats(depth:3)&cats=b2b&ex_q_D2POnSale=bterms(true)&ex_q_sys=bterms(2)&ex_q_skuId=bterms(g9311510,g5367368,g4795959,g4795816,g17356501,g6411761,g5494471,g9831023,g4795898,g9311642)&props_agg_ignore_cat=false&ex_agg_d2pLabel=terms(size:0)&ex_q_not=not(query:<ex_q_itemType=bterms(3)>|<ex_q_itemType=bterms(4)>)&from=0&size=200&sort=D2pSort:1
```


## TODO

1. ?等符号不能触发搜索
2. 自动修复没有
3. quickInfo没有
4. 诊断信息;
5. 只是字符串的拼装, 如果遇到拼装的处理???
6. Snippets添加..
7. 字符串的结构还是要用抽象语法树来表示;;
8. 语法的姿色还要调整下.


##参考

[es-client-JAVA](http://git.dev.qianmi.com/retail/es-client)

[搜索平台查询API文档](http://gitbook.dev.qianmi.com/OF1540/search_platform_book/book/api.html)

[elasticQuery](https://www.elastic.co/guide/en/elasticsearch/reference/5.2/query-dsl-match-query.html)

[vscode-styled-components](https://github.com/styled-components/vscode-styled-components)
