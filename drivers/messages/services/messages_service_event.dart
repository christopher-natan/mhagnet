import 'package:get/get.dart';
import 'package:kitakits/plugins/messages/messages.dart';
import 'package:kitakits/plugins/messages/services/messages_service.dart';

class MessagesServiceEvent extends Messages {
  late final MessagesService _service;
  final RxString onMessagesToConsume = ''.obs;
  int messagesToConsume = 0;
  String name = '::MessagesServiceEvent';

  Future<void> setInit(MessagesService service) async {
    _service = service;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
  }
}
