import { Command, type Token } from "../TemporalLobe/types";

type BundlableCommand = Command.left | Command.right | Command.add | Command.sub;
export type BundledToken = {
    cmd: BundlableCommand,
    count: number
} | {
    cmd: Command.out | Command.in
} | BundledToken[];

export const bundleToken = (token: Token): BundledToken[] => {
    const bundled: BundledToken[] = [];
    let cmd = null as BundlableCommand | null, count = 0;
    const pushBundled = () => {
        if(cmd){
            bundled.push({
                cmd, count
            });
            cmd = null;
        }
    }
    token.forEach(e=>{
        if(cmd == e) count++;
        else{
            pushBundled();
            if(Array.isArray(e)) bundled.push(bundleToken(e));
            else if(e != Command.out && e != Command.in){
                cmd = e; count = 1;
            }else bundled.push({
                cmd: e
            });
        }
    })
    pushBundled();
    return bundled;
}
