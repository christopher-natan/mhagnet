import 'package:get/get.dart';
import 'package:kitakits/plugins/network/network.dart';
import 'package:kitakits/plugins/network/services/network_service.dart';

class NetworkServiceEvent extends Network {
  late NetworkService _service;
  final RxString onNetworkConnected = ''.obs;
  final RxString onNetworkDisconnected = ''.obs;
  String name = '::NetworkServiceEvent';

  Future<void> setInit(NetworkService service) async {
    _service = service;
    setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
  }

  @override
  void onClose() {}
}
