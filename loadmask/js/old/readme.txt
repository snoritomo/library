�X�N���[���[

����API�̓r���[�ƃR���e�i�Ƃ��ċL�q��������q�ɂȂ����^�O�ɑ΂��āA
�r���[�̗̈�����R���e�i���X�N���[�����O����悤�Ȍ��ʂ�����������̂ł��B

����API��jquery�����[�h���Ă��鎖��O��ɍ쐬����Ă��܂��B
���̏�ԂŁAmain.js��scroller.js�����[�h���Ă�������

<script src="js/jquery.js" type="text/javascript" ></script>
<script src="js/main.js" type="text/javascript" ></script>
<script src="js/scroller.js" type="text/javascript" ></script>

�y�������@�z
<div id="xxx"><div id="yyy"></div></div>

�̂悤�ȃ^�O���L�q���A$(document).ready()���ŁA

container = new Scroller('xxx', 'yyy', 30, 10, 1, null, true, 1, 100, 40, false, null, null);

�ƋL�q���܂��B�����͂��ꂼ��

	�r���[ID
	�R���e�iID
	�A�j���[�V�������[�g
	������]�̑��x
	�A�j���[�V�������[�h�i0:margin-left 1:translate3d�j
	�e������ꍇ�͈����ɓn�����ƁB�Ȃ��Ȃ�null
	���߃X�N���[���̗V�т�������
	�N���b�N�Ƃ݂Ȃ��V�т͈̔�
	�N���b�N�ƔF�����鎞�Ԃ͈̔�
	�}�E�X�z�C�[�����ŃX�N���[�������
	�}�E�X�X���C�v�ŃX�N���[�����邩
	�X�N���[���o�[��Ǝ��Ƀf�U�C���������ꍇ�̓N���X��������B�f�t�H���g�ɂ������Ȃ�null
	resize���ɃX�N���[���o�[��ݒ肵���������肷��֐�
	
�ł��B

view�ƌĂ΂��̈�̍������w�肷��K�v������܂��B
����͊֐��̌`�œo�^����K�v������A

container.setViewHeightFunction(function(){
	$('#xxx').height($(window).height()-60);
});

�̂悤�ɋL�q���܂��B
���̂悤�Ȍ`�ɂȂ��Ă���̂́A�r���[�̍��������I�ɕω�����ꍇ�ɑΉ����邽�߂ł��B
�Œ�l�ŗǂ���Ί֐����Ńr���[�ɌŒ�l��ݒ肷��悤�ɂ��Ă��������B
�܂��A���̑��̏������ꏏ�ɋL�q���鎖���ł��܂��B

��ԏ�ɃX�N���[���������ƈ�ԉ��ɃX�N���[���������A�X�N���[���������̃C�x���g�n���h����
�ݒ肷�鎖���ł��܂��B���ꂼ��

container.setOnTop(function(){alert('top');});
container.setOnBottom(function(){alert('bottom');});
container.setOnMove(function(){alert('move');});

�̂悤�ɋL�q���܂��B

�R���e�i�̍������ύX���ꂽ���ɂ͕K���ȉ��̊֐����Ăяo���Ă�������

container.setBar();

��L�֐��̓X�N���[���o�[���Đݒ肷��֐��ɂȂ��Ă���A���݂̃R���e���c�̑傫����
�\���ʒu����K�؂ȃX�N���[���o�[���ĕ\�����܂��B

�܂��A�X�N���[���o�[�̃f�t�H���g�̃X�^�C���͈ȉ��̂悤�ɂȂ��Ă��܂��B

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

�X�N���[���o�[��id="[�r���[��ID]_bar"��div�ō\������Ă����L�X�^�C����style������
�L�q����Ă��܂��B�N���X�����w�肵���ꍇ��style�����̑����class�����Ɏw�肳�ꂽ
�N���X�������ߍ��܂��悤�ɂȂ��Ă���A��L�f�t�H���g�̃X�^�C���͍폜����܂��B
����ɕ��G�ȍ\���̃X�N���[���o�[���K�v�ȏꍇ�́A$('#[�r���[��ID]_bar')���g�p����
�X�N���[���[�쐬���ɍ�肱��ł��������B���������ł�height��top�������삵�܂���̂�
���R�ȍ\�����\���Ǝv���܂��B�܂��A��ID�̗v�f�����ɒǉ�����Ă����ꍇ�͍쐬���܂���B

resize���ɃX�N���[���o�[�ĕ`��֐�container.setBar();���Ă΂�܂����A�����}��������
�ꍇ�͑�P�R�����ɔ���p�̊֐��i�߂�l��true�Ȃ���s�j��n�����Ŏ����ł��܂��B����
���s�v�ł����null��ݒ肵�Ă��������B


