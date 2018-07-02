import ts_module from 'typescript/lib/tsserverlibrary';
import {getCompleteEntry} from './analyse';
import {
  TemplateLanguageService,
  TemplateContext,
} from 'typescript-template-language-service-decorator';

export = (modules: {typescript: typeof ts_module}) => {
  const ts = modules.typescript;
  function create(info: ts.server.PluginCreateInfo) {
    // Get a list of things to remove from the completion list from the config object.
    // If nothing was specified, we'll just remove 'caller'
    info.project.projectService.logger.info(
      "I'm getting set up now! Check the log for this message.processID:"+process.pid
    );

    // Set up decorator
    const proxy: ts.LanguageService = Object.create(null);
    for (let k of Object.keys(info.languageService) as Array<
      keyof ts.LanguageService
    >) {
      const x = info.languageService[k];
      proxy[k] = (...args: Array<{}>) => {
        info.project.projectService.logger.info(
          `${new Date().toString()}esClient: 通过代理调用方法:[${k}]`,
        );

        try {
          let result = x.apply(info.languageService, args);
          return result;
        } catch (err) {
          info.project.projectService.logger.info(err);
          return null;
        }
      };
    }

    proxy.getCompletionsAtPosition = (fileName, position) => {
      let flag  = '444444';
      info.project.projectService.logger.info(
        `esClient: getCompletionsAtPosition ${fileName} ,  ${position}`,
      );
      const prior = info.languageService.getCompletionsAtPosition(
        fileName,
        position,
        undefined,
      );

      //下面这段,即使执行了, 没有用 也会导致没有提示..

      let start = Date.now();
      let entries: ts.CompletionEntry[] = getCompleteEntry(
        '',
        0,
      ).map(entryItem => {
        return {
          name: entryItem.name,
          insertText: entryItem.insertText,
          kind: ts.ScriptElementKind.keyword,
          kindModifiers: '',
          sortText: '0',
        };
      });

      let end  = Date.now();
      info.project.projectService.logger.info(
        `esClient: getCompletionsAtPosition ${flag} elapse: ${end-start}ms,entries::${JSON.stringify(entries)}`,
      );

      prior.entries = entries;
      // prior.entries = [
      //   { name: 'suggests',
      //     insertText: '/suggests/:adminId?',
      //     kind: ts.ScriptElementKind.keyword,
      //     kindModifiers: '',
      //     sortText: '0' },
      //   { name: 'search',
      //     insertText: '/search/:adminId?',
      //     kind: ts.ScriptElementKind.keyword,
      //     kindModifiers: '',
      //     sortText: '0' },
      //   { name: 'spu_search',
      //     insertText: '/spu_search/:adminId?',
      //     kind: ts.ScriptElementKind.keyword,
      //     kindModifiers: '',
      //     sortText: '0' },
      //   { name: 'search',
      //     insertText: '/search/:adminId?',
      //     kind: ts.ScriptElementKind.keyword,
      //     kindModifiers: '',
      //     sortText: '0' },
      //   {"name":"suggests","insertText":"/suggests/:adminId","kind":ts.ScriptElementKind.keyword,"kindModifiers":"","sortText":"0"},
      // ];

      info.project.projectService.logger.info(
        `esClient: getCompletionsAtPosition ${flag} ${JSON.stringify(prior)}`,
      );
      return prior;
    };
    //
    // proxy.getSuggestionDiagnostics=()=>{
    //
    // }

    return proxy;
  }

  return {create};
};
