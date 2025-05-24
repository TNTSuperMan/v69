import { parse } from "./TemporalLobe"
import { bundleToken } from "./ParietalLobe/bundle";
import { optimizeLoop } from "./ParietalLobe/loop";
import { compile } from "./FrontalLobe";

export const generateWASMBytecode = (code: string) =>
    compile(optimizeLoop(bundleToken(parse(code))));

const encoder = new TextEncoder;
const decoder = new TextDecoder;

export const run = async (code: string, input?: string): Promise<string> => {
    const stdout: number[] = [];
    const stdin = encoder.encode(input);
    let stdin_i = 0;
    
    const wasm = await generateWASMBytecode(code);
    const instance = await WebAssembly.instantiate(wasm, { js: {
        stdout(e: number){ stdout.push(e) },
        stdin: () => stdin[stdin_i++] ?? 0
    }});
    //@ts-ignore
    instance.instance.exports.run();

    return decoder.decode(new Uint8Array(stdout));
}
