import 'package:get/get.dart';
import 'package:kitakits/plugins/joins/joins_storage.dart';
import 'package:kitakits/plugins/joins/models/joins_model.dart';
import 'package:kitakits/plugins/joins/services/joins_service.dart';
import 'package:kitakits/plugins/joins/widgets/joins_widget_controller.dart';

class JoinsBinds {
  late JoinsModel joinsModel = JoinsModel();
  late JoinsService joinsService = JoinsService();
  late JoinsStorage joinsStorage = JoinsStorage();
  late JoinsWidgetController joinsWidgetController = JoinsWidgetController();

  JoinsBinds() {
    Get.lazyPut(() => joinsModel, fenix: true);
    Get.lazyPut(() => joinsService, fenix: true);
    Get.lazyPut(() => joinsStorage, fenix: true);
    Get.lazyPut(() => joinsWidgetController, fenix: true);
  }

  Future<void> getFind() async {
    joinsModel = Get.find();
    joinsService = Get.find();
    joinsStorage = Get.find();
    joinsWidgetController = Get.find();
  }
}
