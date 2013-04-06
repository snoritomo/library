ローディングアニメーション画像

※このライブラリの実態はjs/ajaxload.jsのみで、あとはサンプルです。

このAPIは指定したディレクトリ内にある連続した数値をファイル名に持つ画像を経過時間合わせて変更していくAPIです。
コマ割りした画像を一つのディレクトリ内に保存してください

ajaxload.jsをロードしてください

<script src="js/ajaxload.js" type="text/javascript" ></script>

【実装方法】
<div id="aaa"></div>
もしくは
<img id="bbb"/>

のようなタグを記述し、スクリプト内で、

container = new Ajaxload(agrs);

と記述します。引数はそれぞれ

		id: ID（img、もしくはコンテナの）
		path: 画像格納ディレクトリへのURL
		prefix: ファイル名のフレーム番号の前の文字列
		safix: ファイル名のフレーム番号の後の文字列
		rotaterate: 画像の回転速度
		startnum: 画像開始フレーム
		endnum: 画像最終フレーム
		framerate: 画像を変更する秒間の回数
		digit: フレーム番号の桁数

です。

指定されたブロック要素内、もしくはimgタグに画像を表示します。


