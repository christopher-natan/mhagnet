import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/plugins/dialog/services/dialog_service.dart';
import 'package:kitakits/plugins/plugins.dart';
import 'package:kitakits/plugins/settings/models/settings_model.dart';
import 'package:kitakits/plugins/settings/settings_storage.dart';
import 'package:kitakits/storages.dart';

class Settings<T> extends Plugins {
  final GetStorage storage = GetStorage();
  late SettingsStorage settingsStorage = Get.find();
  late SettingsModel settingsModel = Get.find();
  late DialogService dialogService = Get.find();
  late Storages storageService = Get.find();
}
