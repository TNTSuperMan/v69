# V69 BrainFuck engine
V69 is TNTSuperMan's open source Brainfuck engine.

V69 implements Brainfuck asspecified in BF-1919

V69 is written in TypeScript and used in WebBF, the open source Brainfuck runtime from TNTSuperMan.

V69 can run standanole, or can be embedded into any JavaScript and TypeScript application.

V69 Project page: preparing...

## 茶番終了

ここまではV8のreadmeをパクった茶番でございます。  
今回作ったゴミはJIT最適化されたBrainfuckエンジンです。  
TNTSuperManが大好きなTypeScriptで出来てます。  

## パーツ
V8のように面倒くさいパーツみたいなことしました
|パーツ名|内容|
|-|-|
|TemporalLobe(側頭葉)|文法パーサー|
|ParietalLobe(頭頂葉)|最適化|
|FrontalLobe(前頭葉)|バイナリ生成|

## 導入
[bun](https://bun.sh)をインストールした状態でここで
```bash
$ bun i
```
以上

## Todo
- FrontalLobeで直接WASMにする
