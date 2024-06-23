import 'package:flutter/cupertino.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/messages/messages.dart' as plugin;
import 'package:kitakits/plugins/messages/models/messages_model.dart';
import 'package:kitakits/plugins/messages/pages/messages_page_controller.dart';
import 'package:kitakits/utils/app_util.dart';

class MessagesPageEvent extends plugin.Messages {
  late MessagesPageController _controller;
  final TextEditingController textEditingController = TextEditingController();
  final RxString onBackClick = ''.obs;
  final ScrollController listViewController = ScrollController();
  String message = '';
  bool isSending = false;
  String name = '::MessagesPageEvent';

  Future<void> setInit(MessagesPageController controller) async {
    _controller = controller;
    setPluginName(name);
  }

  @override
  Future<void> onReady() async {}

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withMessagesModel();
    await _withMessagesWidgetService();
    await _withFriendsModel();
  }

  Future<void> _withMessagesWidgetService() async {
    await on(chatWidgetService.onShow, () async {
      pr(name, 'chatWidgetService.onShow');
      await messagesModel.fetch();
      await _controller.reset();
    });
  }

  Future<void> _withMessagesModel() async {
    await on(messagesModel.onNewMessage, () async {
      pr(name, 'messagesModel.onNewMessage');
      await _controller.rebuild();
    });

    await on(messagesModel.onSent, () async {
      pr(name, 'messagesModel.onSent');
      message = '';
      textEditingController.clear();
      await _controller.scrollDown();
      await _controller.setSending(isSending: false);
    });

    await on(messagesModel.onNotSent, () async {
      pr(name, 'messagesModel.onNotSent');
      await _controller.setSending(isSending: false);
    });
  }

  Future<void> _withFriendsModel() async {
    await on(friendsModel.onLeftEvent, () async {
      pr(name, 'friendsModel.onLeftEvent');
      guestService.friendLeft = true;
      await _controller.rebuild();
    });
  }

  Future<void> onPressedBack() async {
    await set(onBackClick);
    await messagesModel.setWindowStatus(isOpen: false);
    Get.back(closeOverlays: true);
  }

  Future<void> onPressedPage() async {
    await AppUtil.setKeyboardHidden();
  }

  Future<void> onPressedSend() async {
    if (message.trim().isEmpty) return;
    await _controller.setSending(isSending: true);
    await messagesModel.send(chatMessage: message.trim());
  }

  Future<void> onPressedLike(Messages data) async {
    pr(name, 'onPressedLike');
    await messagesModel.updateLiked(data);
  }

  Future<void> onChangedMessage(String value) async {
    pr(name, 'onChangedMessage');
    message = value;
  }
}
