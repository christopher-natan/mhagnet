import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:kitakits/plugins/network/services/network_service.dart';
import 'package:kitakits/plugins/plugins.dart';

class Network<T> extends Plugins {
  final GetStorage storage = GetStorage();
  late NetworkService creditsService = Get.find();
}
