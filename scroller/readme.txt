スクローラー

※このライブラリの実態はjs/scroller.jsのみで、あとはサンプルです。

このAPIはビューとコンテナとして記述した入れ子になったタグに対して、
ビューの領域内をコンテナがスクローリングするような効果を持たせるものです。

このAPIはjqueryをロードしている事を前提に作成されています。
その状態でscroller.jsをロードしてください

<script src="js/jquery.js" type="text/javascript" ></script>
<script src="js/scroller.js" type="text/javascript" ></script>

【実装方法】
<div id="xxx"><div id="yyy"></div></div>

のようなタグを記述し、$(document).ready()内で、

container = new Scroller(agrs);

と記述します。引数はそれぞれ

		id: ビューID
		cntid: コンテナID
		parent: 親がいる場合は引数に渡すこと。ないならnull
		speed: 自動回転の速度（ピクセル／秒）
		usetranslate: アニメーションモード（0:margin-left 1:translate3d）
		friction: 自動移動の減速加速度。（ミリ秒）
		freetime: 自動移動の減速が発動するまでの時間（ミリ秒）
		framerate: アニメーションレート（秒単位回数）
		clickplay: クリックとみなす遊びの範囲（ピクセル）
		clickplaytime: クリックと認識する時間の範囲（ミリ秒）
		stopborder: 超過スクロールの遊びを許すか
		onwheelrange: マウスホイール一回でスクロールする量（ピクセル）
		handlemouse: マウススワイプでスクロールするか
		barclass: スクロールバーを独自にデザインしたい場合はクラス名を入れる。デフォルトにしたいならnull
		issetbar: resize時にスクロールバーを設定し直すか判定する関数
	
です。

viewと呼ばれる領域の高さを指定する必要があります。
これは関数の形で登録する必要があり、

container.setViewHeightFunction(function(){
	$('#xxx').height($(window).height()-60);
});

のように記述します。
このような形になっているのは、ビューの高さが動的に変化する場合に対応するためです。
固定値で良ければ関数内でビューに固定値を設定するようにしてください。
また、その他の処理を一緒に記述する事もできます。

一番上にスクロールした時と一番下にスクロールした時、スクロールした時のイベントハンドラを
設定する事ができます。それぞれ

container.setOnTop(function(){alert('top');});
container.setOnBottom(function(){alert('bottom');});
container.setOnMove(function(){alert('move');});

のように記述します。

コンテナの高さが変更された時には必ず以下の関数を呼び出してください

container.setBar();

上記関数はスクロールバーを再設定する関数になっており、現在のコンテンツの大きさと
表示位置から適切なスクロールバーを再表示します。

また、スクロールバーのデフォルトのスタイルは以下のようになっています。

width:3px;
position:absolute;
right:2px;
background-color:#DDDDDD;
cursor:pointer;
box-shadow: 0px 0px 1px 1px rgba(180,180,180,1);
-webkit-border-radius : 2px;
-moz-border-radius : 2px;
-o-border-radius : 2px;
-ms-border-radius : 2px;
border-radius : 2px;

スクロールバーはid="[ビューのID]_bar"のdivで構成されており上記スタイルがstyle属性に
記述されています。クラス名を指定した場合はstyle属性の代わりにclass属性に指定された
クラス名が埋め込まれるようになっており、上記デフォルトのスタイルは削除されます。
さらに複雑な構成のスクロールバーが必要な場合は、$('#[ビューのID]_bar')を使用して
スクローラー作成時に作りこんでください。内部処理ではheightとtopしか操作しませんので
自由な構成が可能だと思います。また、同IDの要素が既に追加されていた場合は作成しません。

resize時にスクロールバー再描画関数container.setBar();が呼ばれますが、これを抑制したい
場合は第１３引数に判定用の関数（戻り値がtrueなら実行）を渡す事で実現できます。判定
が不要であればnullを設定してください。


