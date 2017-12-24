let toBeReported: {obj: any, msg: string}[] = [];

export function report(obj: any, msg: string) {
    if (toBeReported.length === 0) {
        setTimeout(outputWarns, 1000);
    }

    toBeReported.push({obj, msg});
}

function outputWarns() {
    if (toBeReported.length === 0) {
        return;
    }

    const objList: any[] = [];
    const warns = toBeReported.filter(({obj}) => {
        const has = objList.indexOf(obj) !== -1;
        if (!has) {
            objList.push(obj);
        }
        return !has;
    });
    for (const w of warns) {
        console.warn(w.msg, w.obj, w.obj._debug);
    }

    toBeReported = [];
}

export {scopeDebug} from './scope';
export {hvDebug} from './hv';
