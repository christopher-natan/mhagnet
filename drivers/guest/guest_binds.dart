import 'package:get/get.dart';
import 'package:kitakits/plugins/guest/services/guest_service.dart';
import 'package:kitakits/plugins/guest/widgets/guest_widget_controller.dart';

class GuestBinds {
  late GuestService guestService = GuestService();
  late GuestWidgetController guestWidgetController = GuestWidgetController();

  GuestBinds() {
    Get.lazyPut(() => guestService, fenix: true);
    Get.lazyPut(() => guestWidgetController, fenix: true);
  }

  Future<void> getFind() async {
    guestService = Get.find();
    guestWidgetController = Get.find();
  }
}
