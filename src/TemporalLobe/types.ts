export const enum Command{
    add=  "+",
    sub=  "-",
    left= "<",
    right=">",
    out=  ".",
    in=   ",",
}

export type Token = (Command | Token)[];
