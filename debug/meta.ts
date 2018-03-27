interface Line {
    file: string;
    line: number;
    col: number;
}

function getLines(stack: string): Line[] {
    const re = /(.+):(\d+):(\d+)$/;
    return (stack.match(/\(.+\)\n/g) || [])
        .map(str => str.slice(1, -2))
        .filter(str => re.test(str))
        .map(str => {
            const res = re.exec(str) || [];
            let [, file, lineStr, colStr] = res;
            const line = Number(lineStr);
            const col = Number(colStr);
            return {file, line, col};
        });
}

declare const XMLHttpRequest: any;
declare const window: any;

function getBrowser(url: string): string {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);

    if (request.status === 200) {
        return request.responseText;
    }

    throw new Error('cannot get ' + url);
}

function getNode(path: string): string {
    const fs = require('fs');
    return fs.readFileSync(path).toString();
}

function getSync(url: string): string {
    return typeof window !== 'undefined'
        ? getBrowser(url)
        : getNode(url);
}

let fileCache: {[key: string]: string[]} = {};

function loadFile(url: string): string[] {
    let result = fileCache[url];

    if (!result) {
        result = getSync(url).split('\n');
        fileCache[url] = result;
    }

    return result;
}

function parseStack(stack: string): string {
    for (const lineObj of getLines(stack)) {
        const line = loadFile(lineObj.file)[lineObj.line - 2];
        const found = /\/\*\*\s*\@name\s*(.+)\s*\*\//.exec(line);
        if (!found) {
            continue;
        }
        console.log(found[1]);
        return found[1];
    }
    return '';
}

let stackCache: {[key: string]: string} = {};

export function getName(stack: string): string {
    let result = stackCache[stack];

    if (!result) {
        result = parseStack(stack);
        stackCache[stack] = result;
    }

    return result;
}
