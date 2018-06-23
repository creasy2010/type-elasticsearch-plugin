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
      "I'm getting set up now! Check the log for this message.",
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
      info.project.projectService.logger.info(
        `esClient: getCompletionsAtPosition ${fileName} ,  ${position}`,
      );
      const prior = info.languageService.getCompletionsAtPosition(
        fileName,
        position,
        undefined,
      );

      let entries: ts.CompletionEntry[] = getCompleteEntry(
        '',
        0,
      ).map(entryItem => {
        return {
          name: entryItem.name,
          insertText: entryItem.insertText,
          kind: ts.ScriptElementKind.keyword,
          kindModifiers: 'esClient',
          sortText: '0',
        };
      });
      prior.entries = entries.concat(prior.entries);

      info.project.projectService.logger.info(
        `esClient: getCompletionsAtPosition 返回值 ${JSON.stringify(prior)}`,
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
