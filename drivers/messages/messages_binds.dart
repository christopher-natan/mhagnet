import 'package:get/get.dart';
import 'package:kitakits/plugins/messages/messages_storage.dart';
import 'package:kitakits/plugins/messages/models/messages_model.dart';
import 'package:kitakits/plugins/messages/pages/messages_page_controller.dart';
import 'package:kitakits/plugins/messages/services/messages_service.dart';


class MessagesBinds {
  MessagesModel messagesModel = MessagesModel();
  MessagesPageController messagesPageController = MessagesPageController();
  MessagesService messagesService = MessagesService();
  MessagesStorage messagesStorage = MessagesStorage();

  MessagesBinds() {
    Get.lazyPut(() => messagesService, fenix: true);
    Get.lazyPut(() => messagesPageController, fenix: true);
    Get.lazyPut(() => messagesModel, fenix: true);
    Get.lazyPut(() => messagesStorage, fenix: true);
  }

  Future<void> getFind() async {
    messagesModel = Get.find();
    messagesPageController = Get.find();
    messagesService = Get.find();
    messagesStorage = Get.find();
  }
}
