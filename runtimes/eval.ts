export const BFEvalJIT = (source: string) => {
    console.time("code")
    const script = `(m,i,stdout)=>{${source.split("").map(e=>{
        switch(e){
            case "[": return "while(m[i]){";
            case "]": return "};";
            case "+": return "m[i]++;";
            case "-": return "m[i]--;";
            case "<": return "i--;";
            case ">": return "i++;";
            case ".": return "stdout.write(String.fromCharCode(m[i]));";
            case ",": throw new Error("Input not implemented");
            default: return "";
        }
    }).join("")}}`;
    console.timeEnd("code");
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
