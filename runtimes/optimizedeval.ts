import { optimizeLoop, type OptimizedToken } from "../src/ParietalLobe/loop";
import { bundleToken } from "../src/ParietalLobe/bundle";
import { parse } from "../src/TemporalLobe";
import { Command } from "../src/TemporalLobe/types";

export const BFOptimizedEvalJIT = (source: string) => {
    const token = optimizeLoop(bundleToken(parse(source)));
    const tostr = (t: OptimizedToken): string => {
        if(Array.isArray(t)) return `while(m[i]){${t.map(e=>tostr(e)).join("")}};`;
        else if(t.cmd == "zero") return "m[i]=0;"
        else switch(t.cmd){
            case Command.add: return `m[i]+=${t.count};`;
            case Command.sub: return `m[i]-=${t.count};`;
            case Command.left: return `i-=${t.count};`;
            case Command.right: return `i+=${t.count};`;
            case Command.out: return "stdout.write(String.fromCharCode(m[i]));";
            case Command.in: throw new Error("Input not implemented");
            default: return "";
        }
    }
    if(!Array.isArray(token)) process.exit();
    const script = `(m,i,stdout)=>{${token.map(e=>tostr(e)).join("")}}`;
    //write("script.js",script)

    const m = new Uint8Array(1024);
    let t = "";
    console.time("init")
    const fn = eval(script);
    console.timeEnd("init");
    console.time("run");
    fn(m, 0, {write(e:string){t+=e}});
    console.timeEnd("run");

    return t;
}
