import type { Command, Token } from "./types";

export const parse = (source: string): Token => {
    const tokens: Token[] = [[]];
    source.split("").forEach(e=>{
        switch (e) {
            case "[":
                tokens.unshift([]);
                break;
            case "]":
                if(tokens.length < 2)
                    throw new SyntaxError();
                tokens[1]!.push(tokens.shift()!);
                break;
            case "+": case "-": case "<": case ">": case ".": case ",":
                tokens[0]!.push(e as Command);
                break;
        }
    })
    return tokens[0]!;
}
