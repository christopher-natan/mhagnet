import 'dart:async';

import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:kitakits/plugins/network/services/network_service_event.dart';

class NetworkService extends NetworkServiceEvent {
  NetworkService() {
    setInit(this);
  }

  Future<void> checkConnectivity() async {
    bool result = await InternetConnectionChecker().hasConnection;
    if (result == true) {
      set(onNetworkConnected);
    } else {
      set(onNetworkDisconnected);
    }
  }

  Future<void> pingConnection({required Function callbackTrue, required Function callbackFalse}) async {
    bool result = await InternetConnectionChecker().hasConnection;
    if (result == true) {
      callbackTrue();
    } else {
      callbackFalse();
    }
  }
}
