import 'package:get/get.dart';
import 'package:kitakits/plugins/network/network_storage.dart';
import 'package:kitakits/plugins/network/services/network_service.dart';

class NetworkBinds {
  NetworkService networkService = NetworkService();
  NetworkStorage networkStorage = NetworkStorage();

  NetworkBinds() {
    Get.lazyPut(() => networkService, fenix: true);
    Get.lazyPut(() => networkStorage, fenix: true);
  }

  Future<void> getFind() async {
    networkService = Get.find();
    networkStorage = Get.find();
  }
}
