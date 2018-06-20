/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/6/19
 **/

import ts from 'typescript/lib/tsserverlibrary';
import {getCompleteEntry} from './analyse';
import {
  TemplateLanguageService,
  TemplateContext,decorateWithTemplateLanguageService} from 'typescript-template-language-service-decorator';


export = (mod: {typescript: typeof ts}) => {
  return {
    create(info: ts.server.PluginCreateInfo): ts.LanguageService {
      return decorateWithTemplateLanguageService(
        mod.typescript,
        info.languageService,
        new EchoTemplateLanguageService(info),
        {tags: ['esClient']},{
          logger:{log : (msg) => {
              console.log(msg);
              // info.project.projectService.logger.info('esClient:****'+msg);
            }}
        }
      );
    },
  };
};


/**
 * 处理逻辑
 *
 * ?q=apple&from=0&size=2
 *
 * 1.空行时
 */
class EchoTemplateLanguageService implements TemplateLanguageService {
  constructor(info: ts.server.PluginCreateInfo) {
    this._info = info;
    this.log('EchoTemplateLanguageService 初始化;;');
  }

  _info: ts.server.PluginCreateInfo;

  log(string) {
    this._info.project.projectService.logger.info('esClient:' + string);
  }

  getCompletionsAtPosition(
    context: TemplateContext,
    position: ts.LineAndCharacter,
  ): ts.CompletionInfo {
    this.log(`getCompletionsAtPosition:: ${context}  --- ${position}`);

    let entries:ts.CompletionEntry[] =getCompleteEntry(context.text,context.toOffset(position)).map(entryItem=>{

      return  {
        name: entryItem.name,
        insertText:entryItem.insertText,
        kind: ts.ScriptElementKind.unknown,
        kindModifiers: 'esClient',
        sortText:entryItem.name
      }
    });

    return {
      isGlobalCompletion: false,
      isMemberCompletion: false,
      isNewIdentifierLocation: false,
      entries,
    };
  }
}
