ゴーランド

※このライブラリの実態はjs/goround.jsのみで、あとはサンプルです。

このAPIは指定したディレクトリ内にある連続した数値をファイル名に持つ画像をタッチ（マウス）ムーブに合わせて変更していくAPIです。


このAPIはjqueryをロードしている事を前提に作成されています。
その状態でgoround.jsをロードしてください

<script src="js/jquery.js" type="text/javascript" ></script>
<script src="js/scroller.js" type="text/javascript" ></script>

【実装方法】
<div id="xxxx" >
</div>

のようなタグを記述し、$(document).ready()内で、

container = new Goround(agrs);

と記述します。引数はそれぞれ

		id: ビューID
		path: 画像ディレクトリへのパスURL
		prefix: ファイル名プレフィックス
		safix: ファイル名サフィックス
		startnum: ファイル名フレーム開始数
		endnum: ファイル名フレーム最終数
		digit: フレーム０桁埋め
		movepx: 画像を回転させるスワイプ量
		framerate: アニメーションレート
		clickplay: クリックとみなすスワイプ量
		clickplaytime: クリックとみなす操作時間
		move_friction: 自動移動の減速加速度。
		move_freetime: 自動移動の減速が発動するまでの時間
		handlemouse: マウスイベントを拾うか
		reverse: 逆回転

です。

指定されたブロック要素内に画像を表示します。イベントを拾うのは画像ではなく指定されたコンテナです。コンテナの上部と下部で回転方向が逆になります。


