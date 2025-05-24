import { compile } from "./FrontalLobe";
import { bundleToken } from "./ParietalLobe/bundle";
import { optimizeLoop } from "./ParietalLobe/loop";
import { parse } from "./TemporalLobe"

export const exec = (source: string, offset?: number) => {
    const token = parse(source);
    const bundled = bundleToken(token);
    const optimized = optimizeLoop(bundled);
    const wasm = compile(optimized, { offset });
    return wasm;
}

export const execRecord = async (source: string, offset?: number) => {
    const ps = performance.now();
    const token = parse(source);
    const pt = performance.now() - ps;
    
    const bs = performance.now();
    const bundled = bundleToken(token);
    const bt = performance.now() - bs;

    const os = performance.now();
    const optimized = optimizeLoop(bundled);
    const ot = performance.now() - os;

    const wr = [0, 0] as [number, number];
    const wasm = await compile(optimized, {
        record: wr, offset
    });

    return [wasm, pt, bt, ot, ...wr] as const;
}
