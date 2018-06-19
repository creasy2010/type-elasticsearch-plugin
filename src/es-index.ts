/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/19
 **/

import ts from 'typescript/lib/tsserverlibrary';
import fse from 'fs-extra'
import { decorateWithTemplateLanguageService } from 'typescript-template-language-service-decorator';



export = (mod: { typescript: typeof ts }) => {
  return {
    create(info: ts.server.PluginCreateInfo): ts.LanguageService {
      info.project.log('esClient:****12312321312312312312312312312');
      return decorateWithTemplateLanguageService(
        mod.typescript,
        info.languageService,
        new EchoTemplateLanguageService(info),
        { tags: ['esClient'] });
    }
  };
};

import { TemplateLanguageService, TemplateContext } from 'typescript-template-language-service-decorator';

class EchoTemplateLanguageService implements TemplateLanguageService {

  constructor(info: ts.server.PluginCreateInfo){
    this._info= info;
    this.log('EchoTemplateLanguageService 初始化;;');
    // setInterval(()=>{this.log('定时任务log')},1000);
  }

  _info :ts.server.PluginCreateInfo;

  log(string){
    this._info.project.log("esClient:"+string);
  };

  getCompletionsAtPosition(
    context: TemplateContext,
    position: ts.LineAndCharacter
  ): ts.CompletionInfo {
    const line = context.text.split(/\n/g)[position.line];
    fse.writeFileSync('/Users/dong/workbench/qmfe/type-elasticsearch-plugin/log.txt','调用了一次');

    this.log(`getCompletionsAtPosition:: ${context}  --- ${position}`);
    return {
      isGlobalCompletion: false,
      isMemberCompletion: false,
      isNewIdentifierLocation: false,
      entries: [
        {
          name: line.slice(0, position.character),
          kind: ts.ScriptElementKind.keyword,
          kindModifiers: 'echo',
          sortText: 'echo'
        }
      ]
    };
  }
}