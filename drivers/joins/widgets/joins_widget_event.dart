import 'dart:async';

import 'package:kitakits/apps.dart';
import 'package:kitakits/plugins/joins/joins.dart';
import 'package:kitakits/plugins/joins/widgets/joins_widget_controller.dart';
import 'package:kitakits/strings.dart';
import 'package:share_plus/share_plus.dart';
import 'package:social_share/social_share.dart';

class JoinsWidgetEvent extends Joins {
  late JoinsWidgetController _controller;
  late Timer timer = Timer(const Duration(seconds: 1), () {});
  JoinsStatus status = JoinsStatus.none;
  String name = '::JoinsWidgetEvent';

  Future<void> setInit(JoinsWidgetController controller) async {
    _controller = controller;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withMapPageCreateService();
    await _withUsersModel();
    await _witFriendsModel();
  }

  Future<void> _withMapPageCreateService() async {
    await on(mapPageCreateService.onJoinsStarted, () async {
      pr(name, 'mapPageCreateService.onHookEventStarted');
      await _controller.open();
    });
  }

  Future<void> _withUsersModel() async {
    await on(usersModel.onSetData, () async {
      if (!usersModel.isHookup()) return;
      pr(name, 'usersModel.onSetData');
      await _controller.open();
      await _controller.startTimer();
    }, priority: 15);

    await on(usersModel.onEventDetached, () async {
      pr(name, 'usersModel.onEventDetached');
      await _controller.close();
      await _controller.stopTimer();
    });

    await on(usersModel.onAttachedHook, () async {
      pr(name, 'usersModel.onAttachedHook');
      await _controller.open();
      await _controller.startTimer();
    });
  }

  Future<void> _witFriendsModel() async {
    await on(friendsModel.onFound, () async {
      pr(name, 'friendsModel.onFound');
      await _controller.close();
      await _controller.stopTimer();
    }, priority: 10);
  }

  Future<void> onPressedCancelHookUp() async {
    await set(dialogService.onCancelHookUp);
  }

  Future<void> onPressedShare() async {
    String share = Strings.msg(Strings.msgJoinCode)
        .replaceAll(Strings.keyJoinCode, joinsModel.getPlainJoinId())
        .replaceAll(Strings.keyAppPlayStoreUrl, Apps.appPlayStoreUrl);
    final result = await Share.shareWithResult(share);

    if (result.status == ShareResultStatus.success) {
      await set(dialogService.onPressedShare);
    }
  }

  Future<void> onPressedShareSms() async {
    String msg = activitiesModel.getMsgRules(Strings.msg('event102'));
    await SocialShare.shareSms(_controller.getMessage(msg)).then((result) => {_onReturnedError(result, 'Sms')});
  }

  Future<void> onPressedShareTwitter() async {
    String msg = activitiesModel.getMsgRules(Strings.msg('event102'));
    await SocialShare.shareTwitter(_controller.getMessage(msg)).then((result) => {_onReturnedError(result, 'Twitter')});
  }

  Future<void> onPressedShareWhatsapp() async {
    String msg = activitiesModel.getMsgRules(Strings.msg('event102'));
    await SocialShare.shareWhatsapp(_controller.getMessage(msg)).then((result) => {_onReturnedError(result, 'Whatsapp')});
  }

  Future<void> onPressedShareTelegram() async {
    String msg = activitiesModel.getMsgRules(Strings.msg('event102'));
    await SocialShare.shareTelegram(_controller.getMessage(msg)).then((result) => {_onReturnedError(result, 'Telegram')});
  }

  Future<void> _onReturnedError(String? result, String socialName) async {
    if (result == 'error') {
      await activitiesModel.setMsgRules(key: '[SOCIAL_NAME]', value: socialName);
      await set(joinsService.onSocialError);
    }
  }

  @override
  Future<void> onClose() async {
    pr(name, 'onClose()');
    await _controller.stopTimer();
    super.onClose();
  }
}
