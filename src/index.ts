import ts_module from "typescript/lib/tsserverlibrary";
import { writeFile} from  'fs-extra';
import { TemplateLanguageService, TemplateContext } from 'typescript-template-language-service-decorator';


export = (modules: {typescript: typeof ts_module}) => {
  const ts = modules.typescript;
  log("hello!!"+process.pid);

  function create(info: ts.server.PluginCreateInfo) {
    // Get a list of things to remove from the completion list from the config object.
    // If nothing was specified, we'll just remove 'caller'
    const whatToRemove: string[] = info.config && info.config.remove || ['caller','queryPermissionGroups'];
    info.project.projectService.logger.info(`hello hello ;;;; `);
    // Diagnostic logging
    info.project.projectService.logger.info("I'm getting set up now! Check the log for this message.");

    // Set up decorator
    const proxy: ts.LanguageService = Object.create(null);
    for (let k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
      const x = info.languageService[k];
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    // Remove specified entries from completion list
    proxy.getCompletionsAtPosition = (fileName, position) => {
      info.project.projectService.logger.info(`getCompletionsAtPosition ${fileName} ,  ${position}`);
      const prior = info.languageService.getCompletionsAtPosition(fileName, position,undefined);
      const oldLength = prior.entries.length;
      prior.entries = prior.entries.filter(e => whatToRemove.indexOf(e.name) < 0);

      // Sample logging for diagnostic purposes
      if (oldLength !== prior.entries.length) {
        info.project.projectService.logger.info(`Removed ${oldLength - prior.entries.length} entries from the completion list`);
      }

      return prior;
    };

    return proxy;
  }

  return { create };
}


function log(data:string){
  writeFile('/Users/dong/workbench/qmfe/egg-plugin/log.log',data,{flag:"a"},()=>{
  });
}