export const toStringMul = (token: {
    cmd: "mul",
    list: [number, number][]
}): string =>{
    return `
    (if (i32.load8_u (local.get $i))
        (then
            local.get $i
            i32.load8_u
            local.set $mul

            ${token.list.map(e=>`
                local.get $i
                i32.const ${e[0]}
                i32.add
                local.set $p

                local.get $p
                local.get $p
                i32.load8_u
                local.get $mul
                i32.const ${e[1]}
                i32.mul
                i32.add
                i32.store8
            `).join("")}

            local.get $i
            i32.const 0
            i32.store8
        )
    )
`
    }