import 'package:get/get.dart';
import 'package:kitakits/plugins/settings/models/settings_model.dart';
import 'package:kitakits/plugins/settings/pages/settings_page_controller.dart';
import 'package:kitakits/plugins/settings/settings_storage.dart';

class SettingsBinds {
  SettingsPageController settingsPageController = SettingsPageController();
  SettingsStorage settingsStorage = SettingsStorage();
  SettingsModel settingsModel = SettingsModel();

  SettingsBinds() {
    Get.lazyPut(() => settingsPageController, fenix: true);
    Get.lazyPut(() => settingsStorage, fenix: true);
    Get.lazyPut(() => settingsModel, fenix: true);
  }

  Future<void> getFind() async {
    settingsPageController = Get.find();
    settingsStorage = Get.find();
    settingsModel = Get.find();
  }
}
