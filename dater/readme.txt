�f�C�^�[

�����̃��C�u�����̎��Ԃ�js/dater.js��res�ȉ��̃��\�[�X�ō\������A���Ƃ̓T���v���ł��B

����API�͓��t���͂𒼊��I�ɍs������ڕW�ɍ쐬�����t�H�[�����i�̃G���n���X���C�u�����ł�

����API��jquery�����[�h���Ă��鎖��O��ɍ쐬����Ă��܂��B
���̏�Ԃ�dater.js��dater.css�����[�h���Ă�������

<link rel="stylesheet" href="res/dater.css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/dater.js"></script>

�y�������@�z
		<input id="dater" type="text" name="inputdate" />

�̂悤�ȃ^�O���L�q���A$(document).ready()���ŁA

var dtr = new Dater(agrs);

�ƋL�q���܂��B�����͂��ꂼ��

	id: �i�K�{�jinput��id
	suggestbasedcalendar: (true)���ړ��͂����Ƃ���suggest list�̃x�[�X�N�������J�����_�[�x�[�X�ɂ���
	inputname: (id+'_')input���ύX�����name����
	informat: (0)���͎��̔���t�H�[�}�b�g�B0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
	outformat: (0)�\���̃t�H�[�}�b�g�B0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
	outdemiliter: (-)�\���̋�؂蕶��
	outstrmonth: (0)�\���̌��\���B0:���l 1:����
	outydigit: (4)�\���̔N����
	outmzero: (true)�\���̌����O���߂��邩
	outdzero: (true)�\���̓����O���߂��邩
	sendformat: (0)���M���̃t�H�[�}�b�g�B0:yyyymmdd 1:ddmmyyyy 2:mmddyyyy
	senddemiliter: (-)���M���̋�؂蕶��
	sendstrmonth: (0)���M���̌��\���B0:���l 1:����
	sendydigit: (4)���M���̔N����
	sendmzero: (true)���M���̌����O���߂��邩
	senddzero: (true)���M���̓����O���߂��邩
	calmin: (-1)�\������J�����_�[�̍ŏ��̌��B��������̑��Ό���
	calmax: (1)�\������J�����_�[�̍Ō�̌��B��������̑��Ό���
	calweeklang: (en)�J�����_�[�̗j���̕\������
	console: �R���\�[���ݒ�I�u�W�F�N�g
		ydigit: (4)�N����
		strmonth: (1)���\���B0:���l 1:����
		mzero: (true)�����O���߂��邩
		dzero: (true)�����O���߂��邩
	input_class: (dater_input)�e�L�X�g�{�b�N�X�ɂ�����class
	console_class: (dater_console)�\�������R���g���[���{�b�N�X�ɂ�����class
	console_left_pane_class: (dater_console_left)�R���g���[���{�b�N�X�̍��y�C���ɂ�����class
	console_right_pane_class: (dater_console_right)�R���g���[���{�b�N�X�̉E�y�C���ɂ�����class
	suggest_list_class: (dater_suggest_list)���͂ɑ΂�����t���ꗗ�ɂ�����class
	suggest_list_selected_class: (dater_suggest_list_selected)�I�𒆂̓��t���ɂ�����class
	suggest_list_hover_class: (dater_suggest_list_hover)�}�E�Xhover���Ă���li�ɂ�����class
	calendar_block_class: (dater_calendar_block)�J�����_�[�̈�ɂ�����class
	calendar_control_class: (dater_calendar_control)�J�����_�[�R���g���[���{�b�N�X�ɂ�����class
	year_box_class: (dater_year_box)�N�̈�ɂ�����class
	year_prev_class: (dater_year_prev)�N�̍����{�^���ɂ�����class
	year_next_class: (dater_yaer_next)�N�̉E���{�^���ɂ�����class
	year_class: (dater_year)�N��\������̈�ɂ�����class
	month_box_class: (dater_month_box)���̈�ɂ�����class
	month_prev_class: (dater_month_prev)���̍����{�^���ɂ�����class
	month_next_class: (dater_month_next)���̉E���{�^���ɂ�����class
	month_class: (dater_month)����\������̈�ɂ�����class
	calendar_header_class: (dater_calendar_header)�P���̃J�����_�[�̉�������\�������ɂ�����class
	calendar_class: (dater_calendar)�J�����_�[�e�[�u���ɂ�����class
	calendar_sunday_class: (dater_calendar_sunday)���j��td�ɂ�����class
	calendar_saturday_class: (dater_calendar_saturday)�y�j��td�ɂ�����class
	calendar_onday_class: (dater_calendar_onday)������td�ɂ�����class
	calendar_today_class: (dater_calendar_today)������td�ɂ�����class
	calendar_selected_day_class: (dater_calendar_selected_day)�I�����ꂽ���t��td�ɂ�����class
	calendar_out_of_month_class: (dater_calendar_out_of_month)�e�[�u�����̌��O���t��td�ɂ�����class
	calendar_hover_day_class: (dater_calendar_hover_day)�}�E�Xhover���Ă���td�ɂ�����class
	
�ł��B

�t�H�[�J�X�������ƊO�ꂽ���̃C�x���g�n���h�������ꂼ��o�^�ł��܂�

container.setOnFocus(function(){alert('focus');});
container.setOnBlur(function(){alert('blur');});

�̂悤�ɋL�q���܂��B

�X�^�C���̕ύX�͈����ɂĂ��ꂼ�ꂠ�Ă����Ă���class��ύX������Adater.css�𒼐�
�ҏW���邱�Ƃōs�������o���܂��B



