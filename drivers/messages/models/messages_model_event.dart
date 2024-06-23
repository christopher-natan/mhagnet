import 'package:get/get.dart';
import 'package:kitakits/plugins/messages/messages.dart' as plugin;
import 'package:kitakits/plugins/messages/models/messages_model.dart';

class MessagesModelEvent extends plugin.Messages {
  late MessagesModel _model;

  final RxString onNotSent = ''.obs;
  final RxString onError = ''.obs;
  final RxString onNewMessage = ''.obs;
  final RxString onFetched = ''.obs;
  final RxString onSent = ''.obs;
  final RxString onSavedLike = ''.obs;
  bool isWindowOpen = false;
  String name = '::MessagesEvent';

  Future<void> setInit(MessagesModel model) async {
    _model = model;
    setPluginName(name);
  }
}
