import { Command } from "../TemporalLobe/types";
import type { BundledToken } from "./bundle";

export type OptimizedToken = BundledToken | {
    cmd: "zero"
} | {
    cmd: "mul",
    list: [number, number][] // pos / count
} | OptimizedToken[]

export const optimizeLoop = (token: BundledToken[]): OptimizedToken => {
    if(token.length == 1 && !Array.isArray(token[0]) && token[0]!.cmd == Command.sub && token[0]!.count == 1) return { cmd: "zero" };
    if(token.every(e=>!Array.isArray(e) && e.cmd != "." && e.cmd != ",")){
        const es = token as (Exclude<BundledToken, BundledToken[]>)[];
        if(es[0]?.cmd == "-"){
            const list = [] as [number, number][];
            let pos = 0;
            es.toSpliced(0, 1).forEach(e=>{
                switch(e.cmd){
                    case ">": pos += e.count; break;
                    case "<": pos -= e.count; break;
                    case "+": list.push([pos,  e.count]); break;
                    case "-": list.push([pos, -e.count]); break;
                    default: pos = Infinity;
                }
            })
            if(pos == 0) return {
                cmd: "mul",
                list
            }
        }
    }
    return token.map(e=>{
        if(Array.isArray(e)) return optimizeLoop(e);
        else return e;
    });
}
