デイター

※このライブラリの実態はjs/dater.jsとres以下のリソースで構成され、あとはサンプルです。

このAPIは日付入力を直感的に行う事を目標に作成したフォーム部品のエンハンスライブラリです

このAPIはjqueryをロードしている事を前提に作成されています。
その状態でdater.jsとdater.cssをロードしてください

<link rel="stylesheet" href="res/dater.css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/dater.js"></script>

【実装方法】
		<input id="dater" type="text" name="inputdate" />

のようなタグを記述し、$(document).ready()内で、

var dtr = new Dater(agrs);

と記述します。引数はそれぞれ

	id: （必須）inputのid
	suggestbasedcalendar: (true)直接入力したときのsuggest listのベース年月日をカレンダーベースにする
	inputname: (id+'_')inputが変更されるname属性
	displayicon: (true)カレンダーアイコンをインプットの右に表示するか
	informat: (0)入力時の判定フォーマット。0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
	outformat: (0)表示のフォーマット。0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
	outdemiliter: (-)表示の区切り文字
	outstrmonth: (0)表示の月表示。0:数値 1:文字
	outydigit: (4)表示の年桁数
	outmzero: (true)表示の月を０埋めするか
	outdzero: (true)表示の日を０埋めするか
	sendformat: (0)送信時のフォーマット。0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
	senddemiliter: (-)送信時の区切り文字
	sendstrmonth: (0)送信時の月表示。0:数値 1:文字
	sendydigit: (4)送信時の年桁数
	sendmzero: (true)送信時の月を０埋めするか
	senddzero: (true)送信時の日を０埋めするか
	calmin: (-1)表示するカレンダーの最初の月。今月からの相対月数
	calmax: (1)表示するカレンダーの最後の月。今月からの相対月数
	calweeklang: (en)カレンダーの曜日の表示言語
	console: コンソール設定オブジェクト
		ydigit: (4)年桁数
		strmonth: (1)月表示。0:数値 1:文字
		mzero: (true)月を０埋めするか
		dzero: (true)日を０埋めするか
	input_class: (dater_input)テキストボックスにつけられるclass
	icon_class: (dater_icon)アイコンimgタグにつけられるclass
	icon_src: (res/dater-icon.png)アイコン画像のURL
	console_class: (dater_console)表示されるコントロールボックスにつけられるclass
	console_left_pane_class: (dater_console_left)コントロールボックスの左ペインにつけられるclass
	console_right_pane_class: (dater_console_right)コントロールボックスの右ペインにつけられるclass
	suggest_list_class: (dater_suggest_list)入力に対する日付候補一覧につけられるclass
	suggest_list_selected_class: (dater_suggest_list_selected)選択中の日付候補につけられるclass
	suggest_list_hover_class: (dater_suggest_list_hover)マウスhoverしているliにつけられるclass
	calendar_block_class: (dater_calendar_block)カレンダー領域につけられるclass
	calendar_control_class: (dater_calendar_control)カレンダーコントロールボックスにつけられるclass
	year_box_class: (dater_year_box)年領域につけられるclass
	year_prev_class: (dater_year_prev)年の左側ボタンにつけられるclass
	year_next_class: (dater_yaer_next)年の右側ボタンにつけられるclass
	year_class: (dater_year)年を表示する領域につけられるclass
	month_box_class: (dater_month_box)月領域につけられるclass
	month_prev_class: (dater_month_prev)月の左側ボタンにつけられるclass
	month_next_class: (dater_month_next)月の右側ボタンにつけられるclass
	month_class: (dater_month)月を表示する領域につけられるclass
	calendar_header_class: (dater_calendar_header)１月のカレンダーの何月かを表す部分につけられるclass
	calendar_class: (dater_calendar)カレンダーテーブルにつけられるclass
	calendar_sunday_class: (dater_calendar_sunday)日曜のtdにつけられるclass
	calendar_saturday_class: (dater_calendar_saturday)土曜のtdにつけられるclass
	calendar_onday_class: (dater_calendar_onday)平日のtdにつけられるclass
	calendar_today_class: (dater_calendar_today)今日のtdにつけられるclass
	calendar_selected_day_class: (dater_calendar_selected_day)選択された日付のtdにつけられるclass
	calendar_out_of_month_class: (dater_calendar_out_of_month)テーブル内の月外日付のtdにつけられるclass
	calendar_hover_day_class: (dater_calendar_hover_day)マウスhoverしているtdにつけられるclass
	
です。

フォーカスした時と外れた時のイベントハンドラをそれぞれ登録できます

container.setOnFocus(function(){alert('focus');});
container.setOnBlur(function(){alert('blur');});

のように記述します。

スタイルの変更は引数にてそれぞれあてがわれているclassを変更したり、dater.cssを直接
編集することで行う事が出来ます。


【展開するときの注意】
また、cssファイルや画像などのリソースファイルの配置場所を変更した際にはcss内のurlや、
引数のicon_srcを使って適切な場所を指定するようにしてください。



