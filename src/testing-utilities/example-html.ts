import * as fs from 'fs';

// https://stackoverflow.com/questions/16697791/nodejs-get-filename-of-caller-function
function _getCallerFile(): string {
  const originalFunc = Error.prepareStackTrace;

  let callerFile: any;
  try {
    const err = new Error() as any;
    let currentFile;

    Error.prepareStackTrace = function(err, stack) {
      return stack;
    };

    currentFile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerFile = err.stack.shift().getFileName();
      if (currentFile !== callerFile) break;
    }
  } catch (e) {}
  Error.prepareStackTrace = originalFunc;
  return callerFile;
}

export function writeExampleHtml(id: string, html: string) {
  const callerFile = _getCallerFile();
  const split = callerFile.split('/');
  const callerDirectory = split.slice(0, split.length - 1).join('/');
  const examplesDirectory = `${callerDirectory}/__examples__`;
  if (!fs.existsSync(examplesDirectory)) fs.mkdirSync(examplesDirectory);
  fs.writeFileSync(`${examplesDirectory}/${id}.html`, html);
}

export function getExampleHtml(id: string) {
  const callerFile = _getCallerFile();
  const split = callerFile.split('/');
  const callerDirectory = split.slice(0, split.length - 1).join('/');
  const examplesDirectory = `${callerDirectory}/__examples__`;
  return fs.readFileSync(`${examplesDirectory}/${id}.html`).toString();
}
