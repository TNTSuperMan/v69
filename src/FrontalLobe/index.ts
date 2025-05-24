import initWabt from "wabt";
import type { OptimizedToken } from "../ParietalLobe/loop";
import { Command } from "../TemporalLobe/types";
import { toStringMul } from "./mul";

const wabt_promise = initWabt();

let loopi = 0;

const tostring = (token: OptimizedToken): string => {
    if(Array.isArray(token)){
        const i = loopi++;
        return `(if (i32.load8_u (local.get $i))
            (then (loop $l${i}
                ${token.map(e=>tostring(e)).join("\n")}
                local.get $i
                i32.load8_u
                br_if $l${i}
            ))
        )`
    }else{
        switch(token.cmd){
            case "zero": return `
                local.get $i
                i32.const 0
                i32.store8`
            case "mul": return toStringMul(token);
            case Command.add: return `
                local.get $i
                local.get $i
                i32.load8_u
                i32.const ${token.count}
                i32.add
                i32.store8`
            case Command.sub: return `
                local.get $i
                local.get $i
                i32.load8_u
                i32.const ${token.count}
                i32.sub
                i32.store8`
            case Command.left: return `
                local.get $i
                i32.const ${token.count}
                i32.sub
                local.set $i`
            case Command.right: return `
                local.get $i
                i32.const ${token.count}
                i32.add
                local.set $i`
            case Command.out: return `
                local.get $i
                i32.load8_u
                call $stdout`
            case Command.in: return `
                local.get $i
                call $stdin
                i32.store8`;
        }
    }
}

export const compile = async (token: OptimizedToken, opt?: {
    record?: [number, number],
    offset?: number
}): Promise<Uint8Array> => {
    if(!Array.isArray(token)) throw new Error("Not array");
    const ws = performance.now();
    const wat =
`(module
    (import "js" "stdout" (func $stdout (param i32)))
    (import "js" "stdin" (func $stdin (result i32)))
    (memory (export "mem") 10)
    (func (export "run") (local $i i32) (local $mul i32) (local $p i32)
        i32.const ${opt?.offset ?? 327680}
        local.set $i
        ${token.map(e=>tostring(e)).join("\n")}
    )
)`;
    if(opt?.record) opt.record[0] = performance.now() - ws;

    const bs = performance.now();
    const wabt = await wabt_promise;
    const binary = wabt.parseWat("out.wat", wat).toBinary({}).buffer;
    if(opt?.record) opt.record[1] = performance.now() - bs;

    return binary;
}
